// Next.js API route support: https://nextjs.org/docs/api-routes/introduction



export default function handler(req, res) {
  
  if (req.method === 'GET') {

    res.status(200).json(
      [{"age":null,"birthdate":null,"email":"test_1@gmail.com","finger_registered":"Yes","firstname":"Pr\u00e9nom","height":null,"id_user":0,"lastname":"Nom","password":"12345","sex":"M","strava_info":null,"weight":null},{"age":null,"birthdate":null,"email":null,"finger_registered":"No","firstname":"Michel","height":null,"id_user":2,"lastname":"Jean","password":null,"sex":null,"strava_info":null,"weight":null},{"age":null,"birthdate":null,"email":null,"finger_registered":"No","firstname":"Pierre","height":176,"id_user":4,"lastname":"Violeau","password":null,"sex":"M","strava_info":{"access_token":"812f0d33b1cee8afd174500d714be1ce70ded277","athlete":{"badge_type_id":0,"bio":"D1 duathlon \ud83c\udfc3\ud83d\udeb4\ud83c\udfc3\nGirondins de Bordeaux Triathlon","city":"Gif sur Yvette","country":"France","created_at":"2017-06-13T15:16:05Z","firstname":"Pierre","follower":null,"friend":null,"id":22661227,"lastname":"Violeau","premium":false,"profile":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/22661227/8085506/1/large.jpg","profile_medium":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/22661227/8085506/1/medium.jpg","resource_state":2,"sex":"M","state":"","summit":false,"updated_at":"2024-01-13T17:20:01Z","username":null,"weight":64.0},"client_id":111597,"client_secret":"1486fb9d215fb16277ed2c3c35a992c1fda1aeba","expires_at":1705532587,"expires_in":21600,"refresh_token":"66140b7591c541f87e4e4c7cc7b2b6e98fa81115","token_type":"Bearer"},"weight":66},{"age":63,"birthdate":"Sun, 23 Oct 1960 00:00:00 GMT","email":"test_2@gmail.com","finger_registered":"No","firstname":"Pr\u00e9nom","height":null,"id_user":8,"lastname":"Nom","password":"12345","sex":"M","strava_info":null,"weight":null}]
  
  );
    
  }

}
