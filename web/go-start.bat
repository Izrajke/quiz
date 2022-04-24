@ECHO OFF
cd ..
go build cmd/quiz/main.go
main.exe && cd web