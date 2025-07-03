fetch('words.txt')
    .then(response => response.text())
    .then(text => {
        const wordList = text
            .split('\n')
            .map(w => w.trim())
            .filter(w => w.length === 5);
        const logindiv = document.getElementById("login");
        setTimeout(() => {
            logindiv.style.display = "flex";
        }, 500)
        const loginclose = document.getElementById("loginclose");
        loginclose.addEventListener("click", function () {
            setTimeout(() => {
                logindiv.style.display = "none";
            }, 500)
        })
        const nickname = document.getElementById("nickname");
        const savebtn = document.getElementById("savebtn");

        savebtn.addEventListener("click", Save);
        let isloggedin = false;

        function Save() {
            let usersArr = [];
            let wins = 0;
            let fails = 0;
            const user = {
                nickname: nickname.value.trim(),
                wins: wins,
                fails: fails,
            }
            usersArr.push(user);
            const data = localStorage.getItem("users");
            if (data == null) {
                localStorage.setItem("users", JSON.stringify(usersArr));
            } else {
                usersArr = JSON.parse(data);
                userexist = usersArr.find(el => el.nickname == nickname.value.trim());
                if (!userexist) usersArr.push(user);
                localStorage.setItem("users", JSON.stringify(usersArr));
            }
            isloggedin = true;
            logindiv.style.display = "none";
        }
        const start_block = document.getElementById("start");
        const body = document.getElementById("body");
        const rules = document.getElementById("rules");
        const cubes = document.getElementById("cubes");
        const keyboard = document.getElementById("keyboard");
        const keyboard_mobile = document.getElementById("keyboard_mobile");
        const windiv = document.getElementById("win");
        const losediv = document.getElementById("lost");
        const clickSound = new Audio("sounds/click.mp3");
        const startButton = document.getElementById("start-button");
        startButton.addEventListener('click', start);
        function start() {
            start_block.style.display = "none";
            body.style.backgroundColor = "#000";
            setTimeout(() => {
                rules.classList.toggle("show");
            }, 600);

        }
        const leadersboard = document.getElementById("leadersboard");
        const board = document.getElementById("board");
        const board_content = document.getElementById("board_content");
        const boardclose = document.getElementById("boardclose");
        leadersboard.addEventListener("click", function () {
            let users = JSON.parse(localStorage.getItem("users")) || [];
            const validUsers = users.filter(user => user.nickname && user.nickname.trim() !== "");
            if (validUsers.length > 0) {
                board_content.innerHTML = "";
                validUsers.sort((a, b) => b.wins - a.wins);
                validUsers.forEach(user => {
                    board_content.innerHTML += `
                        <div class="user-score">
                          <span class="nickname">${user.nickname}</span>
                          <span class="score">🏆 ${user.wins}</span>
                          <span class="fail">💔 ${user.fails}</span>
                        </div>`;
                });
            } else {
                board_content.innerHTML = `<p class="no_user">No logged-in users!</p>`;
            }
            setTimeout(() => {
                board.style.display = "flex";
            }, 600);
        })
        boardclose.addEventListener("click", function () {
            setTimeout(() => {
                board.style.display = "none";
            }, 600);
        })


        const close = document.getElementById("close");
        close.addEventListener("click", function () {
            setTimeout(() => {
                rules.classList.toggle("show");
                cubes.classList.add("showcubes");
                keyboard.classList.add("showkeyboard");
                keyboard_mobile.classList.add("showkeyboard")
            }, 600);
        });

        let randomindex = Math.trunc(wordList.length * Math.random());
        let winword = wordList[randomindex];
        console.log(winword);

        const allCubes = document.querySelectorAll("#cubes > div");
        const cubeArray = Array.from(allCubes);
        let btn = [...keyboard.querySelectorAll("button")];
        let btn_mobile = [...keyboard_mobile.querySelectorAll("button")];


        let currentIndex = 0;
        let currentRow = 0;
        let currentWord = [];

        function processGuess() {
            let guess = currentWord.join("");

            if (!wordList.includes(guess)) {
                const message = document.getElementById("notinlist");
                setTimeout(() => {
                    message.classList.add("showmessage");
                }, 600);
                const messageclose = document.getElementById("messageclose");
                messageclose.addEventListener("click", () => {
                    message.classList.remove("showmessage");
                });
                return false;
            }

            for (let i = 0; i < 5; i++) {
                let letter = guess[i];
                let cube = cubeArray[currentIndex - 5 + i];
                let findequal = btn.find(el => el.textContent.toLowerCase() == letter);
                let findequal_mobile = btn_mobile.find(el => el.textContent.toLowerCase() == letter);
                if (guess[i] === winword[i] && findequal) {
                    findequal.style.setProperty("background-color", "#538d4e", "important");
                    findequal_mobile.style.setProperty("background-color", "#538d4e", "important");
                    cube.classList.add("green");
                } else if (winword.includes(guess[i]) && findequal) {
                    cube.classList.add("orange");
                    findequal.style.setProperty("background-color", "#b59f3b", "important");
                    findequal_mobile.style.setProperty("background-color", "#b59f3b", "important");
                } else {
                    cube.classList.add("grey");
                    findequal.style.setProperty("background-color", "#4d4d4e", "important");
                    findequal_mobile.style.setProperty("background-color", "#4d4d4e", "important");
                }
            }

            if (guess === winword) {
                setTimeout(() => {
                    windiv.classList.add("showwin");
                }, 600);
                const winclose = document.getElementById("winclose");
                winclose.addEventListener("click", () => {
                    windiv.classList.remove("showwin");
                });
                const users = JSON.parse(localStorage.getItem("users") || []);
                const usercurrent = users.find(el => el.nickname == nickname.value.trim());
                usercurrent.wins++;
                localStorage.setItem("users", JSON.stringify(users));

            } else {
                currentRow++;
                currentIndex = 5 * currentRow;
                currentWord = [];
            }

            if (currentIndex === 30 && guess !== winword) {
                setTimeout(() => {
                    losediv.classList.add("showlost");
                }, 600);
                const lostclose = document.getElementById("loseclose");
                lostclose.addEventListener("click", () => {
                    losediv.classList.remove("showlost");
                });
                const users = JSON.parse(localStorage.getItem("users"));
                const usercurrent = users.find(el => el.nickname == nickname.value.trim());
                usercurrent.fails++;
                localStorage.setItem("users", JSON.stringify(users));
            }
            return true;
        }


        keyboard.addEventListener("mousedown", function (event) {
            const key = event.target.textContent.toLowerCase();

            clickSound.currentTime = 0;
            clickSound.play();

            if (key.length === 1 && key >= "a" && key <= "z") {
                if (currentWord.length < 5) {
                    cubeArray[currentIndex].textContent = key.toUpperCase();
                    currentWord.push(key);
                    currentIndex++;
                }
            } else if (event.target.id === "enter" && currentWord.length === 5) {
                processGuess();
            } else if (event.target.id === "clear" && currentWord.length > 0) {
                currentIndex--;
                cubeArray[currentIndex].textContent = "";
                currentWord.pop();
            }
        });

        keyboard.addEventListener("mouseup", function () {
            clickSound.pause();
            clickSound.currentTime = 0;
        });
        keyboard_mobile.addEventListener("mousedown", function (event) {
            const key = event.target.textContent.toLowerCase();
            console.log(key);

            clickSound.currentTime = 0;
            clickSound.play();

            if (key.length === 1 && key >= "a" && key <= "z") {
                if (currentWord.length < 5) {
                    cubeArray[currentIndex].textContent = key.toUpperCase();
                    currentWord.push(key);
                    currentIndex++;
                }
            } else if (event.target.id === "enter_mobile" && currentWord.length === 5) {
                processGuess();
            } else if (event.target.id === "clearbtn_mobile" && currentWord.length > 0) {
                currentIndex--;
                cubeArray[currentIndex].textContent = "";
                currentWord.pop();
            }
        });

        keyboard_mobile.addEventListener("mouseup", function () {
            clickSound.pause();
            clickSound.currentTime = 0;
        });
        let isKeyPressed = false;


        window.addEventListener("keydown", function (event) {
            let key = event.key.toLowerCase();
            if (!isloggedin && nickname.value) return;

            if (!/^[a-z]$/.test(key) && key !== "enter" && key !== "backspace") {
                return;
            }

            if (!isKeyPressed) {
                clickSound.currentTime = 0;
                clickSound.play();
                isKeyPressed = true;
            }

            if (/^[a-z]$/.test(key)) {
                if (currentWord.length < 5) {
                    cubeArray[currentIndex].textContent = key.toUpperCase();
                    currentWord.push(key);
                    currentIndex++;
                }
            } else if (key === "enter" && currentWord.length === 5) {
                processGuess();
            } else if (key === "backspace" && currentWord.length > 0) {
                currentIndex--;
                cubeArray[currentIndex].textContent = "";
                currentWord.pop();
            }
        });

        window.addEventListener("keyup", function () {
            if (isKeyPressed) {
                clickSound.pause();
                clickSound.currentTime = 0;
                isKeyPressed = false;
            }
        });
        window.newgame = function () {
            currentIndex = 0;
            currentRow = 0;
            currentWord = [];

            cubeArray.forEach(cube => {
                cube.textContent = "";
                cube.className = "";
            });

            btn.forEach(el => {
                el.style.removeProperty('background-color');
            });
            btn_mobile.forEach(el => {
                el.style.removeProperty('background-color');
            });

            randomindex = Math.trunc(wordList.length * Math.random());
            winword = wordList[randomindex];
            console.log(winword);
            windiv.classList.remove("showwin");
            losediv.classList.remove("showlost");


        };
    })
    .catch(error => console.error('Loading error:', error));
