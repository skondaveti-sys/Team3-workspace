## Section 1: Table with Team Members Information

| Name              | GitHub Username |
| ----------------- | --------------- |
| Rachel Gao        | rgao05          |
| Shritan Kondaveti | skondaveti-sys  |
| Nitya Vobugari    | nityavobugari18 |
| Daniela Ramos     | msobriquet      |

## Section 2: Working Agreement

- We will communicate day-to-day using our group chat on iMessages. Occasionally we can call or use zoom if needed.
- "Done" for a pull request means that it is complete, doesn't cause any errors, and is reviewed by at least one team member.
- We will solve disagreements by bringing them up and discussing the problem with one another in a civil manner. Each of us can voice our thoughts on the matter and then as a team come to some sort of compromise where the issue is addressed/solved in a way that everyone agrees seems fit and benefits the project. If the disagreement is still unresolved we can ask an outside party for advice.

## Section 3: Project Domain
Our team was thinking of building some sort of public transportation helper. Some of us found that information like cost, time schedules, and routes were not easily accessible. We would have to dig through multiple links online, or read the many confusing signs on public transportation stops to get the information we needed. So this helper can make transit information less confusing to navigate and have all of it in one place. This would benefit other students like us, those who come from a low-income background, and senior citizens. 

## Section 4: How to run it
In order to run our program, you should clone the repository on github, run ```npm install``` to download the neccesary dependencies, and then run ```npm start``` to run the server on your local machine. Visit localhost:3000 to see the home page. *This is subject to change, considering it is not the most accessible for our current target audience.*

## Feature: report an outage

Go to `/outages`. Enter a station and a description of what is not working (for example "Elevator to platform B is out"), next you press "Report outage". The report is sent to the server (`POST /outages`), saved, and appears in the "Reported outages" list on the page without a reload. It is still there after a refresh or a server restart.

If either field is empty, the server answers 400 with "Enter both a station and a description of the problem." and nothing is saved. If the server cannot be reached, the page informs us of that. A malformed request body also gets a 4xx response, and the server keeps running.

Checking trips against reported outages is not built yet.

## System Diagram

```
Browser: /outages page (views/outages.ejs + public/outages.js)
  GET /outages                 POST /outages {station, description}
        |                              |
        v                              v
server.js     json parsing, 404, error handler
        |
        v
routes/outages.js                wires paths to controller functions, wrapped in asyncHandler
        |
        v
controllers/outagesController.js reads req, calls the service, sends res (200 render / 201 json / error status)
        |
        v
services/outagesService.js       validation: station and description required (400); uses dtos/outageDto.js
        |
        v
repositories/outagesRepository.js  only file that reads and writes storage
        |
        v
data/outages.json
```

<!-- Teammates: add your slice's path to this diagram, next to the one I put above. -->

## Design Decisions

Shritan Kondaveti: 