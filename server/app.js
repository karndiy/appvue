const express = require('express');
const request = require('request');
//const mysql = require('mysql2/promise');
const cDBmysql = require('./cDB');
const { handleError } = require('./errorHandler');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000; // Feel free to change the port number



// MySQL database connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'appDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
  
// Example of using the pool to make a query
//const xdb = new Database(dbConfig);
const db =  new cDBmysql(dbConfig);

// Async function to ensure the database connection works
async function checkDatabaseConnection() {
    try {
        // Attempt to execute a simple query
       // const result = await xdb.execute('SELECT 1');
        //console.log('Connected to MySQL database! xdb', result);

        const results = await db.execute('SELECT 1');
        console.log('Connected to MySQL database! db', results);
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

checkDatabaseConnection();

async function duplication_user(username) {
    const query = "SELECT * FROM users WHERE username = ?";
    const xuser = await db.get_oop(query, [username]);
    return xuser;
}

app.use(cors()); // Enable CORS for all route
app.use(express.json()); // Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


var mainUrl  = ''
var brandcode_main = ''
var agent_main = ''
var currencycode_main = ''
var agentKey_main = '' 

// Assuming 'db' is already initialized and available here
// You need to ensure 'db' is correctly set up before calling load_configs

async function load_configs(db) {
    const rows = await db.get_oop('SELECT * FROM `config_data`');
    const configData = rows.reduce((acc, row) => {
        acc[row.config_key] = row.config_value;
        return acc;
    }, {});
    console.log(configData);
    //console.log('mm->' + configData['mainUrl']);
    return configData;
}

async function initializeAppConfig() {
    try {
        // Load configuration from the database
        const config = await load_configs(db)
        
        // Assign the fetched configurations to global variables
        console.log(config)
        mainUrl = config['mainUrl'];
        brandcode_main = config['brandcode_main'];
        agent_main = config['agent_main'];
        currencycode_main = config['currencycode_main'];
        agentKey_main = config['agentKey_main'];

        // Now, the global variables are set, and you can proceed with your application logic
        console.log("Configuration loaded successfully. Application can now proceed.");
        startServer();
        
        // Example: startApplication(); // Call a function to start the rest of your app logic
    } catch (error) {
        console.error("Failed to load configuration:", error);
    }
}


function startServer() {

    console.log('main-url:-> ' + mainUrl)
app.get('/', (req, res) => {
    res.send('Hello from the backend!' + mainUrl);
  });


  app.get('/getallusers', async (req, res) => {
    const query = "SELECT id,username ,password,created_at FROM users";
    
    try {
        // As `get_oop` expects a query and variables, and since we don't have variables for this query, we pass an empty array.
        const result = await db.get_oop(query, []);
        res.json(result); // Send JSON response
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('An error occurred while fetching users');
    }
});

app.get('/gettoken', (req, res) => {
    var options = {
        'method': 'POST',
        'url': mainUrl+'/gettoken', // Updated with your actual URL
        'headers': {},
        'formData': {            
           // 'brandcode': brandcode_main,
            //'agent': 'ggapiuser',
            //'agentKey': 'jcwS4eavdN/oktRmcZtapA=='
            'brandcode': brandcode_main ,
            'agent': agent_main,
            'agentKey': agentKey_main            
        }
    };
    
    request(options, function (error, response) {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('An error occurred');
        }        
        console.log(response.body);
        res.send(response.body); // You might want to parse JSON if needed
    });
});


app.post('/getagentbalance', (req, res) => {
    console.log(req.body.apitoken)
    var options = {
        'method': 'POST',
        'url': mainUrl+'/getagentbalance', // Updated with your actual URL
        headers: {
            'Authorization': `Bearer ${req.body.apitoken}`,
        },
        'formData': {            
            'brandcode': brandcode_main,            
        }  
           
    };    
    request(options, function (error, response) {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('An error occurred');
        }        
        console.log(response.body);
        res.send(response.body); // You might want to parse JSON if needed
    });
});


// Modified registration endpoint
app.post('/register', (req, res) => {
    // Here you would retrieve or set your API token dynamically
    //const apiToken = 'YourAPITokenHere'; // Update this accordingly
    const apiToken = req.body.tokken
    
    var options = {
        method: 'POST',
        url: mainUrl+'/register',
        headers: {
            'Authorization': `Bearer ${req.body.apitoken}`,
        },
        formData: {
            'brandcode': brandcode_main,
            'username': req.body.username, // Dynamically set from request body
            'password': req.body.password,
            'currencycode': 'THB',
            'ip': '127.0.0.1',
            //'bankid': '71', 
            //'accountname': 'GAPI Member 02 Bank', // Dynamically set from request body
            //'accountnumber': '324583053821',

        }
    };

    request(options, async function (error, response) {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('An error occurred');
        }

        try {
            const parsedBody = JSON.parse(response.body);            

            // Assume success and now insert/update user info in the database
            // Adjust the query and variables according to your database schema and requirements
            
            const udup = await duplication_user(req.body.username);
            if (udup.length > 0) {
                // User already exists, handle accordingly
                console.log('User already exists:', udup);
                return res.status(400).send('User already exists.');
            }
            const query = "INSERT INTO users ( `username`, `password`, `currencycode`, `ip`, `created_at`) VALUES (?, ?, ?, ?, current_timestamp() )";
            const variables = [
                req.body.username, 
                req.body.password, 
                'THB', 
                '127.0.0.1',               
                           
            ];
            await db.create_oop(variables, query);
            console.log('insert new user')
            res.json(parsedBody);

        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).send('An error occurred parsing the response');
        }
    });
});

// Modified registration endpoint
app.post('/login', (req, res) => {
    
    //const apiToken = 'YourAPITokenHere'; // Update this accordingly
    const apiToken = req.body.tokken
    
    var options = {
        method: 'POST',
        url: mainUrl+'/login',
        headers: {
            'Authorization': `Bearer ${req.body.apitoken}`,
        },
        formData: {  
            'brandcode': brandcode_main,         
            'username': req.body.username, // Dynamically set from request body
            'password': req.body.password,          
            'ip': '127.0.0.1',  
        }
    };
    
    request(options, function (error, response) {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('An error occurred');
        }

        try {
            const parsedBody = JSON.parse(response.body);
            console.log('login:' + response.body)
            res.json(parsedBody);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).send('An error occurred parsing the response');
        }
    });

});


app.post('/userinfo',  (req, res) => {
   // console.log(req.body.username)
    //console.log(req.body.apitoken)
    try {   
    
    var options = {
        method: 'POST',
        url: mainUrl+'/getmemberinfo',
        headers: {
            'Authorization': `Bearer ${req.body.apitoken}`,
        },
        formData: {  
            'brandcode': brandcode_main,         
            'username': req.body.username, // Dynamically set from request body
            'withbank':'true',                     
            'ip': '127.0.0.1',  
        }
    };

    request(options, async function  (error, response) {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('An error occurred');
        }

        try {
            const parsedBody = await JSON.parse(response.body);
            console.log(parsedBody )
            res.json(parsedBody);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).send('An error occurred parsing the response');
        }
    });

    }catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      } 
});

app.post('/deposit', (req, res) => {
    console.log('deposit' + req.body.apitoken)
    var options = {
        'method': 'POST',
        'url': mainUrl+'/deposit', // Updated with your actual URL
        headers: {
            'Authorization': `Bearer ${req.body.apitoken}`,
        },
        'formData': {            
            'brandcode': brandcode_main,             
            'username': req.body.username,
            'amount': req.body.amount,
            'agent': agent_main,
            'ip':  req.body.ip,         
        }             
    };    
    request(options, function (error, response) {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('An error occurred');
        }        
        console.log(response.body);
        res.send(response.body); // You might want to parse JSON if needed
    });
});


app.post('/withdrawal', (req, res) => {
    console.log('withdrawal' + req.body.apitoken)
    var options = {
        'method': 'POST',
        'url': mainUrl+'/withdrawal', // Updated with your actual URL
        headers: {
            'Authorization': `Bearer ${req.body.apitoken}`,
        },
        'formData': {            
            'brandcode': brandcode_main,             
            'username': req.body.username,
            'amount': req.body.amount,
            'agent': agent_main,
            'ip':  req.body.ip,         
        }             
    };    
    request(options, function (error, response) {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('An error occurred');
        }        
        console.log(response.body);
        res.send(response.body); // You might want to parse JSON if needed
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
}
initializeAppConfig();