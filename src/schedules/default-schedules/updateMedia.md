 trigger

let newMedia: {streamName, type}[] = []
let removedMedia: {streamName, type}[] = []

Function Collect mediaDifferences(url, type)
    --> collect local media (streamName & type)
    --> collect online media (streamName & type)
    --> create two lists (new media & removed media)
    --> add newMedia to list
    --> add removedMedia to list

await mediaDifferences("https://aniwor", "anime")
await mediaDifferences("https://s.to", "series")

// new and removed media is sorted

for each in removedMedia --> update online_aviable to false

