// Next.js API route support: https://nextjs.org/docs/api-routes/introduction



export default function handler(req, res) {
  
    if (req.method === 'GET') {

      // Get the id of the video like this : req.query.id_video
      const id_user = req.query.id_user;
  
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json"); 
  
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };     
   
  
      fetch("https://myo6.duckdns.org/api/"+id_user+"/get_training_load_data", requestOptions)
        .then(response => response.json())
        .then(result => res.status(200).json(result))
        .catch(error => console.log('error', error));
      
    }
  
  }
  