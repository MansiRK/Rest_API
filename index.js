const http = require("http")

const Users = [
    {
        name: "Bruce",
        age: 25
    },
    {
        name: "Tony",
        age: 30
    },
    {
        name: "Steve",
        age: 70
    }
]

const server = http.createServer(function (request, response) {

    const paths = request.url.split("/")

    console.log("---methods--- ", request.method)


    //To get all users
    if (request.method === "GET" && paths[1] === "users" && paths.length === 2) {
        response.write(JSON.stringify(Users))
    }

    //To get single user
    else if (request.method === "GET" && paths[1] === "users" && paths[2]) {
        const idx = paths[2]
        const user = Users[idx]
        if (user) {

            response.write(JSON.stringify(user))
        } else {
            response.write("Not Found")
        }
    }

    //To add new user
    else if (request.method === "POST" && paths[1] === "users") {
        let data = "" //declration of data

        // "on" is event listener
        request.on("data", function (chunk) {
            data += chunk
            console.log("New added user is: ", data)
        })

        request.on("end", function () {
            const obj = JSON.parse(data.toString())
            Users.push(obj)
        })

        response.statusCode = 201
        response.write("User data created")
    }

    //To update existing user
    else if (request.method === "PUT" && paths[1] === "users" && paths[2]) {
        const idx = paths[2]
        let data = ""

        if (Users[idx]) {
            request.on("data", function (chunk) {
                data += chunk

                console.log("Updated changes are:", data)
            })

            request.on("end", function () {
                const obj = JSON.parse(data.toString())

                // To update new property we use spread function
                Users[idx] = {
                    ...Users[idx],
                    ...obj
                }
            })
            response.write("User data updated")
            console.log("User which is updated is: ", Users[idx])
        }
    }

    // To delete user by matching name

    else if (request.method === "DELETE" && paths[1] === "users" && paths[2]) {

        const name = paths[2]

        const idx = Users.findIndex(element => element.name.toLowerCase() === name.toLowerCase())
        if (idx === -1) {
            response.write("User not found")
        }
        else {
            Users.splice(idx, 1)
            response.write("User data deleted sucessfully")
            // console.log("Deleted user is : ", Users[idx])
        }
    }

    else {
        response.write("Not Found")
    }
    response.end()
})

server.listen(3000, function () {
    console.log("server is running on port number 3000")
})
