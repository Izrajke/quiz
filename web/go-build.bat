@ECHO OFF
cd ../cmd/quiz
go build
move quiz.exe ../../web >nul
cd ../../web
ren "quiz.exe" "server.exe"