@ECHO OFF
cd ..
go build ./cmd/quiz
quiz.exe && cd web