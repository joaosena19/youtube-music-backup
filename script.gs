function Execute() {
  let myEmail = 'YOUR EMAIL HERE';
  let keyword = 'THE KEYWORD IN THE PLAYLISTS YOU WANT TO BACKUP';

  let playlists = GetPlaylists();

  let filteredPlaylists = playlists.filter((playlist) => {if(playlist.title.includes(keyword)) return playlist})

  let playlistWithVideos = GetVideos(filteredPlaylists);

  let message = FormatMessageVideosList(playlistWithVideos);

  SendMail(message, myEmail);
}

function GetPlaylists(){
    let playlists = YouTube.Playlists.list(
      [
        "snippet,contentDetails"
      ], 
      {
        "maxResults": 9999,
        "mine": true
      }
    )

    let playlistsName = [];

    playlists.items.map((playlist) => {
      playlistsName.push({
        "id": playlist.id,
        "title": playlist.snippet.title,
        "videos": []
      })
    })

    return playlistsName;
}

function GetVideos(playlists){
  playlists.forEach((playlist) => {
    let playlistsVideos = YouTube.PlaylistItems.list('snippet',{
      playlistId: playlist.id,
      maxResults: 9999,
    });

    playlistsVideos.items.forEach((video) => {
      playlist.videos.push({
        "title": video.snippet.title,
        "channel": video.snippet.videoOwnerChannelTitle,
      });
    });
  });

  return playlists;
}

function FormatMessageVideosList(playlistWithVideos){
  let message = '';

  playlistWithVideos.forEach((playlist) => {
    message = message.concat('', '----- ' + playlist.title + ' -----')

    playlist.videos.forEach((video) => {
      message = message.concat('\n', "• " + video.title + ' - ' + video.channel)
    })

    message = message.concat('\n', '\n');
  })

  return message;
}

function SendMail(message, myEmail){
    MailApp.sendEmail(myEmail,"Backup Youtube - " + new Date().toLocaleDateString(), message);
}