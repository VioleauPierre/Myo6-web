import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ComposedChart,CartesianGrid, Tooltip, Legend, ResponsiveContainer,BarChart,Bar,Area,DefaultLegendContent } from 'recharts';
import { Card, CardHeader, CardContent } from '@mui/material';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import withAuth from '../components/withAuth';

function Home(props) {
  const router = useRouter();
  const { id_user } = router.query;
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const baseUrl = props.DEBUG_MODE === 'true' ? "http://localhost:3000/" : "https://myo6-web.vercel.app/";

  const [users, setUsers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const [isBilanSelected, setIsBilanSelected] = useState(true);
  const [isNewTabSelected, setIsNewTabSelected] = useState(false);
  const [isQuestionnaireSelected, setIsQuestionnaireSelected] = useState(false);

  const [weeklyRunningLoad, setWeeklyRunningLoad] = useState([]);
  const [weeklyBikeLoad, setWeeklyBikeLoad] = useState([]);
  const [heartRateData, setHeartRateData] = useState(null);
  const [pupillometryData, setPupillometryData] = useState([]);
  const [ctlData, setCTLData] = useState([]);

  useEffect(() => {
    const loggedInUserId = sessionStorage.getItem('id_user');
    const loggedInUserRole = sessionStorage.getItem('role');
    setCurrentUserId(loggedInUserId);
    setCurrentUserRole(loggedInUserRole);

    if (loggedInUserId && id_user && loggedInUserId !== id_user && loggedInUserRole !== 'admin') {
      alert("You are not authorized to access this page.");
      router.replace(`/coachPage5?id_user=${loggedInUserId}`);
    }

    getUser();
  }, [id_user, router]);

  async function getUser() {
    const res = await fetch(baseUrl + 'api/getAllUser', {});
    const data = await res.json();
    const loggedInUserId = Number(sessionStorage.getItem('id_user'));
    const loggedInUserRole = sessionStorage.getItem('role');
    setCurrentUserId(loggedInUserId);
    setCurrentUserRole(loggedInUserRole);

    if (loggedInUserRole !== 'admin') {
      setUsers([data.find(user => user.id_user === loggedInUserId)]);
    } else {
      setUsers(data);
    }
  }

  useEffect(() => {
    if (id_user) {
      setSelectedValue(id_user);
      fetchCoachPageData(id_user);
    }
  }, [id_user]);

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedValue(selectedOption);
    fetchCoachPageData(selectedOption);
  };

  const fetchCoachPageData = async (userId) => {
    try {
      const runningLoadResponse = await fetch('https://myo6.duckdns.org/' + 'api/weekly_running_load/' + userId);
      const runningLoadData = await runningLoadResponse.json();
      setWeeklyRunningLoad(runningLoadData);
  
      const bikeLoadResponse = await fetch('https://myo6.duckdns.org/' + 'api/weekly_bike_load/' + userId);
      const bikeLoadData = await bikeLoadResponse.json();
      setWeeklyBikeLoad(bikeLoadData);

      const heartRateResponse = await fetch('https://myo6.duckdns.org/' + 'api/heartrate/' + userId);
      const heartRateData = await heartRateResponse.json();
      setHeartRateData(heartRateData);
  
      const pupillometryResponse = await fetch('https://myo6.duckdns.org/' + 'api/pupillometry/' + userId);
      const pupillometryData = await pupillometryResponse.json();
      setPupillometryData(pupillometryData);

      const ctlResponse = await fetch('https://myo6.duckdns.org/' + 'api/' + userId + '/get_training_load_data_2');
      const ctlData = await ctlResponse.json();
      setCTLData(ctlData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
          // Extract the bounds from the payload
          const bounds = payload.find(entry => entry.name === 'bound');
          
          // Format the bounds as a string if they exist
          const boundsString = bounds ? `Normal range: ${bounds.value[0]} - ${bounds.value[1]}` : '';
  
          return (
              <div style={{ backgroundColor: '#333', padding: '10px', borderRadius: '5px' }}>
                  <h4 style={{ color: '#fff' }}>{label}</h4>
                  {payload
                      .filter(entry => entry.name !== 'bound') // Exclude 'bound' from tooltip
                      .map((entry) => (
                          <p style={{ color: entry.color }} key={entry.name}>
                              {`${entry.name}: ${entry.value}`}
                          </p>
                      ))}
                  {boundsString && <p style={{ color: '#00FFFF' }}>{boundsString}</p>} {/* Display the bounds */}
              </div>
          );
      }
      return null; // Return null if the tooltip is not active

 
  };
  const renderLegendWithoutBound = (props) => {
    const { payload, ...rest } = props;
    const newPayload = payload.filter(entry => entry.dataKey !== 'bound');
    return <DefaultLegendContent {...rest} payload={newPayload} />;
  };

  const CustomTooltipCTL = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { Date, CTL } = payload[0].payload; // Get date and CTL values
      return (
        <div style={{ backgroundColor: '#333', border: 'none', color: '#fff', padding: '10px' }}>
          <p>{`${Date}`}</p>
          <p style={{ color: '#FF7F50' }}>{`Condition Physique: ${CTL}`}</p> {/* Set text color */}
        </div>
      );
    }
    return null;
  };

  const renderLegend = () => (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
      {/* <span style={{ color: '#ffc658' }}>Rest Heart Rate</span> */}
      <span style={{ color: '#B22222' }}>VFC</span>
      {/* <span style={{ color: '#82ca9d' }}>Mean Bounds</span> */}
    </div>
  );
  const getMonthlyTicks = (data) => {
    const ticks = new Set();
    data.forEach(entry => {
      const date = new Date(entry.Date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`; // Set day to 01 for uniformity
      ticks.add(monthYear);
    });
    return Array.from(ticks).sort(); // Sort to ensure correct order
  };
  
  return (
    <div className="h-screen w-screen bg-gray-900 text-white">
      <Header />
      <Navbar />
      <div className='flex min-h-[calc(100%-84px)] bg-gray-900 h-auto'>
        <div id="main_code" className="h-full w-full">
          <select
            value={selectedValue}
            onChange={handleSelectChange}
            className="bg-gray-700 text-white rounded-lg m-2 sm:m-4 w-auto shadow-xl text-md sm:text-lg"
          >
            {users.map(user => (
              <option key={user.id_user} value={user.id_user}>
                {user.firstname} {user.lastname}
              </option>
            ))}
          </select>

          <div className="w-full flex h-10 bg-gray-700">
            {['Bilan', 'Mesures', 'Activités', 'Questionnaire'].map((tab, index) => (
              <React.Fragment key={index}>
                <button
                  className="w-1/4 bg-gray-800 hover:bg-gray-500 h-full flex justify-center items-center text-white transition duration-300 text-xs md:text-sm lg:text-base xl:text-lg"
                  onClick={() => {
                    setIsBilanSelected(index === 0);
                    setIsNewTabSelected(index === 2);
                    setIsQuestionnaireSelected(index === 3);
                  }}
                >
                  {tab}
                </button>
                {index < 3 && <div className="w-1 bg-gray-900 h-full"></div>}
              </React.Fragment>
            ))}
          </div>

          {isBilanSelected ? (
            <div className="bg-gray-900 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">

              <Card className="bg-gray-800">
                  <div className="bg-gray-800 p-2">
                    <div className="bg-gray-800 p-4 text-center">
                      <h3 className="text-white text-lg">Pupil index</h3>
                    </div>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                          <ComposedChart data={pupillometryData.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis 
                              stroke="#888" 
                              domain={[2, 3.4]}
                            />
                            <Legend content={renderLegendWithoutBound} />
                            
                            {/* Area between bounds */}
                            <Area
                              type="monotone"
                              dataKey="bound"
                              stroke="none"
                              fill="#00FFFF"
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                            
                            <Line 
                            type="monotone" 
                            dataKey="rolling_avg" 
                            stroke="#00FFFF" 
                            name="Pupil index" 
                            connectNulls={true}
                            />
                            <Line
                              type="monotone"
                              dataKey={() => pupillometryData.mean}
                              stroke="#D3D3D3 "
                              strokeDasharray="5 5"
                              name="Mean"
                              dot={false}
                              connectNulls={true}
                            />
                            <Tooltip content={<CustomTooltip />} />
                          </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </div>
                </Card>

                <Card className="bg-gray-800">
                  <div className="bg-gray-800 p-2">
                    <div className="bg-gray-800 p-4 text-center">
                      <h3 className="text-white text-lg">Heart Rate Index</h3>
                    </div>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    {heartRateData && heartRateData.data ? (
                      <ComposedChart data={heartRateData.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis 
                          stroke="#888" 
                          domain={['30', '50']} // Adjust the domain based on your data
                        />
                        <Legend content={renderLegend} />

                        {/* Area between bounds */}
                        {/* <Area
                          type="monotone"
                          dataKey="bound"
                          stroke="none"
                          fill="#82ca9d"
                          fillOpacity={0.3}
                          connectNulls={true}
                        /> */}
{/*                         
                        Line for heart rate
                        <Line 
                          type="monotone" 
                          dataKey="HR Rest" 
                          stroke="#ffc658" 
                          name="Rest Heart Rate" 
                          connectNulls={true}
                        /> */}
                        
                        {/* Line for lnrmssd_lying */}
                        <Line 
                          type="monotone" 
                          dataKey="VFC" 
                          stroke="#FF0000" 
                          name="VFC" 
                          connectNulls={true} 
                          dot={false}
                        />
                        
                        {/* Line for mean (if necessary)
                        <Line
                          type="monotone"
                          dataKey={() => heartRateData.mean}
                          stroke="#82ca9d"
                          strokeDasharray="5 5"
                          name="Mean"
                          dot={false}
                          connectNulls={true}
                        /> */}
                        
                        <Tooltip content={<CustomTooltip />} />
                      </ComposedChart>
                    ) : (
                      <p>Loading data...</p>  // You can customize this loading state
                    )}
                  </ResponsiveContainer>
                </CardContent>
                </div>
            </Card>

            <Card className="bg-gray-800">
              <div className="bg-gray-800 p-2">
              <div className="bg-gray-800 p-4 text-center"> {/* Center the text */}
                {/* Replace CardHeader with a custom header */}
                <h3 className="text-white text-lg">Weekly Running Load</h3> {/* Adjust text size */}
              </div>
              <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyRunningLoad}>
                      <XAxis dataKey="week_start" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} cursor={false}/>
                      <Legend />
                      <Bar dataKey="Running Load" fill="#1E90FF" activeBar={false}/>
                    </BarChart>
                  </ResponsiveContainer>
              </CardContent>
              </div>
            </Card>
           

            <Card className="bg-gray-800">
              <div className="bg-gray-800 p-2">
              <div className="bg-gray-800 p-4 text-center"> {/* Center the text */}
                {/* Replace CardHeader with a custom header */}
                <h3 className="text-white text-lg">Weekly Cycling Load</h3> {/* Adjust text size */}
              </div>
              <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyBikeLoad}>
                      <XAxis dataKey="week_start" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} cursor={false}/>
                      <Legend />
                      <Bar dataKey="Cycling Load" isAnimationActive={false} fill="#FF7F50"  />
                    </BarChart>
                  </ResponsiveContainer>
              </CardContent>
              </div>
            </Card>

            <Card className="bg-gray-800">
              <div className="bg-gray-800 p-2">
                <div className="bg-gray-800 p-4 text-center">
                  <h3 className="text-white text-lg">Condition Physique</h3>
                </div>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={ctlData}>
                      <XAxis dataKey="Date" ticks={getMonthlyTicks(ctlData)} stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip content={<CustomTooltipCTL />} /> {/* Set custom tooltip here */}
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="CTL"
                        stroke="#FF7F50"
                        fillOpacity={0.4} // Adjust fill opacity here
                        fill="#FF7F50" 
                        isAnimationActive={false} // Disable animation for smoother rendering
                        legendType="none"// Fill color below the line
                      />
                      <Line
                        type="monotone"
                        dataKey="CTL"
                        stroke="#FF7F50"
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </div>
            </Card>
            </div>


          ) : isNewTabSelected ? (
            <div className='h-screen'>
              <iframe src={baseUrl + "Activity2?user_id=" + selectedValue} width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
            </div>
          ) : isQuestionnaireSelected ? (
            <div className='h-screen'>
              <iframe src={baseUrl + "questionnairec?user_id=" + selectedValue} width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
            </div>
          ) : (
            <div className='h-screen'>
              <iframe src={baseUrl + "MesureEmbeded_v2?user_id=" + selectedValue} width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: { DEBUG_MODE: process.env.DEBUG_MODE },
  };
}

Home.displayName = 'Home';

export default withAuth(Home, ['admin', 'athlete']);