chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "OFF",
    });
  });

//const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'
  
chrome.action.onClicked.addListener(async (tab) => {
    //if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
      // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
      const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
      // Next state will always be the opposite
      const nextState = prevState === 'ON' ? 'OFF' : 'ON'
  
      // Set the action badge to the next state
      await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
      });

      if (nextState === "ON") {
        // Insert the CSS file when the user turns the extension on
        function addNBA() {
            const body = document.querySelector('body');
            console.log("yo")
            const nbaHeader = document.createElement('div');
            const style = (node, styles) => Object.keys(styles).forEach(key => node.style[key] = styles[key])
            style(nbaHeader, {
                display: 'flex',
                position: 'fixed',
                justifyContent: 'flex-start',
                alignItems: 'center',
                top: '0px',
                left: '0px',
                width: '100%',
                height: '150px',
                backgroundColor: 'white'
            });
            console.log(body)
            console.log(nbaHeader)
            body.appendChild(nbaHeader);

            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'b8c9e92460mshbb0ab17d649287bp134be8jsn3012c522aa46',
                    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
                }
            };
            
            fetch('https://api-nba-v1.p.rapidapi.com/games?date=2023-04-05', options)
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    for (let i = 0; i < 3; i++) {
                        const teams = response.response[i].teams;
                        const scores = response.response[i].scores;
                        console.log("teams", teams);
                        console.log("scores", scores);

                        // main div for game
                        const game = document.createElement('div');
                        style(game, {
                            display: 'flex',
                            //width: '200px',
                            height: '100%',
                            marginLeft: '40px'
                        });

                        // home team
                        const homeTeam = document.createElement('div');
                        style(homeTeam, {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '33%',
                            height: '100%',
                        });

                        // home team data
                        const homeLabel = document.createElement('h4');
                        homeLabel.textContent = "Home"
                        style(homeLabel, {
                            width: '100%',
                            height: '10px',
                            margin: '10px',
                            textAlign: 'center'
                        });

                        const homeLogo = document.createElement('img');
                        homeLogo.src = teams.home.logo;
                        style(homeLogo, {
                            width: '70px',
                            height: '70px',
                            margin: '5px'
                        });

                        // const teamName = document.createElement('h2');
                        // homeTeam.textContent = teams.home.name;
                        // style(teamName, {
                        //     width: '100%',
                        //     height: '10px',
                        //     margin: '5px'
                        // });

                        homeTeam.appendChild(homeLabel);
                        homeTeam.appendChild(homeLogo);
                        //homeTeam.appendChild(teamName);

                        game.appendChild(homeTeam);

                        // score
                        const scoreDiv = document.createElement('div');
                        style(scoreDiv, {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '33%',
                            height: '100%',
                            marginLeft: '20px',
                            marginRight: '20px'
                        });


                        const homeScore = document.createElement('h2');
                        homeScore.textContent = scores.home.points;
                        style(homeScore, {
                            width: '100%',
                            height: '10px',
                            margin: '10px',
                            textAlign: 'center'
                        });

                        const dash = document.createElement('h2');
                        dash.textContent = " - ";
                        style(dash, {
                            width: '100%',
                            height: '10px',
                            margin: '10px',
                            textAlign: 'center'
                        });

                        const awayScore = document.createElement('h2');
                        awayScore.textContent = scores.visitors.points;
                        style(awayScore, {
                            width: '100%',
                            height: '10px',
                            margin: '10px',
                            textAlign: 'center'
                        });

                        scoreDiv.appendChild(homeScore);
                        scoreDiv.appendChild(dash);
                        scoreDiv.appendChild(awayScore);

                        game.appendChild(scoreDiv);

                        // away team
                        const awayTeam = document.createElement('div');
                        style(awayTeam, {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '33%',
                            height: '100%',
                        });

                        // home team data
                        const awayLabel = document.createElement('h4');
                        awayLabel.textContent = "Away"
                        style(awayLabel, {
                            width: '100%',
                            height: '10px',
                            margin: '10px',
                            textAlign: 'center'
                        });

                        const awayLogo = document.createElement('img');
                        awayLogo.src = teams.visitors.logo;
                        style(awayLogo, {
                            width: '70px',
                            height: '70px',
                            margin: '5px'
                        });

                        // const teamName = document.createElement('h2');
                        // homeTeam.textContent = teams.home.name;
                        // style(teamName, {
                        //     width: '100%',
                        //     height: '10px',
                        //     margin: '5px'
                        // });

                        awayTeam.appendChild(awayLabel);
                        awayTeam.appendChild(awayLogo);
                        //homeTeam.appendChild(teamName);

                        game.appendChild(awayTeam);


                        // ADD GAME to header
                        nbaHeader.appendChild(game);
                    }
                })
                .catch(err => console.error(err));
            
        }
          
          chrome.scripting
              .executeScript({
                target : {tabId : tab.id},
                func : addNBA,
              })
              .then(() => console.log("injected a function"));

      } else if (nextState === "OFF") {
        // Remove the CSS file when the user turns the extension off
        console.log("nextState: ", nextState)
      }
      
    //}
});