@ECHO OFF
cd ../cmd/quiz
go build
move quiz.exe ../../web >nul
cd ../../web
if exist "server.exe" del "server.exe"
ren "quiz.exe" "server.exe"