package main

import (
	"fmt"
)

func greeting() {
	fmt.Println("\n\t.:: Please navigate to http://127.0.0.1:8080/ ::.\n")
}

func main() {
	greeting()

	httpEngine().Run()
}
