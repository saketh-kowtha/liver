const { throughDir, readFile, generateRouteFromFile, toJSON, objToArray, setRelativePath, addSlashAtFirst, validateMethod, logger } = require("./utils");
const express = require('express')
const app = express()

app.use(logger)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next()
})

app.use(express.static('./mocks'))


const files = throughDir("./mocks")

files.forEach(file => {
    file = setRelativePath(file)
    console.log(file);
    const content = readFile(file)
    const parsedContent = toJSON(content)
    const route = addSlashAtFirst(generateRouteFromFile(file))
    parsedContent.route = route
    createDynamicRouteFrom(parsedContent)
})

function createDynamicRouteFrom(routeInfo){
    const {response, headers, route} = routeInfo
    const method = validateMethod(routeInfo.method)

    function controller(req, res){
        headers.forEach(header => {
            const [headerKey, headerValue] = objToArray(header)
            res.setHeader(headerKey, headerValue)
        })

        switch(typeof response){
            case 'object':
                return res.json(response)
            default:
                return res.send(response)
        }
    }

    app[method](route, controller)
}

app.all("*", (req, res) => res.status(404).send('Nothing is here'))

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Mockserver started on port number: ${PORT}`)
})
