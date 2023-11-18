const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://ineedsumsnack0308:ineedsumsnack2004@tienvm2004.lfouc8n.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();

// async function main() {
//     try{
//         await client.connect();
//         await listDbs(client);
        
//         // await insert(client, {
//         //     username: "hehe",
//         //     password: "hehe"

//         // })
//         if(await find(client, "hehe", "hehe")) {
//             console.log("Found the user");
//         } else {
//             console.log("User not found");
//         }
//     } catch(e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }
// main().catch(console.error);

async function listDbs(client) {
    const list = await client.db().admin().listDatabases();
    console.log("lmao");
    list.databases.forEach(db => {
        console.log(`- ${db.name}`);
    }) 
}

async function insert(client, username, password) {
    const result = await client.db("csdl").collection("baocao")
    .insertOne({
        username: username,
        password: password
                });

    console.log(`id of inserted listing is ${result.insertedId}`);
}

async function find(client, username, password) {
    const result = await client.db("csdl").collection("baocao")
    .findOne({
        username: username,
        password: password
    })

    if(result) {
        console.log(`found the bitch`);
        return true;
    } else {
        console.log(`No return found with username ${username}`)
        return false;
    }
}

async function findByUserName(client, username) {
    const result = await client.db("csdl").collection("baocao")
    .findOne({
        username: username,
    })

    if(result) {
        console.log(`found the bitch`);
        return true;
    } else {
        console.log(`No return found with username ${username}`)
        return false;
    }
}

async function processLogin(event) {
    event.preventDefault(); 
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if(await findByUserName(client, username)) {
        console.log("An user with this username already exists. Change your username.");
        return false;
    } else {
        await insert(client, username, password);
        console.log("Saving to database: ", username, password);
    }
    
}

