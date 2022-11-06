const express = require('express')
const request = require('request-promise');
var bodyParser = require('body-parser');
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/** 
 * ?use port 4567(can be change)
 */
const port = 4567

/** 
 * ?question 1
 * *get method
*/
app.get("/list_of_Top_Posts", async (req, res) => {
    let comment = {};
    let post = {};
    let data = [];

    // get comment data
    const options = {
        method: "GET",
        uri: "https://jsonplaceholder.typicode.com/comments",
        json: true,
        headers: {
            "Content-Type": "application/json",
        },
    };

    await request(options)
        .then(function (response) {
            comment = response;
        })
        .catch(function (err) {
            console.log(err);
        });

    // get post data
    const options2 = {
        method: "GET",
        uri: "https://jsonplaceholder.typicode.com/posts",
        json: true,
        headers: {
            "Content-Type": "application/json",
        },
    };

    await request(options2)
        .then(function (response) {
            post = response;
        })
        .catch(function (err) {
            console.log(err);
        });

    // insert data of post and comment
    post.map((i) => {
        let temp = comment.filter(e => e.postId == i.id);
        data.push({
            post_id: i.id,
            post_title: i.title,
            post_body: i.body,
            total_number_of_comments: temp.length,
        });
    })

    // sort data by decending order/top comment first
    data.sort((a, b) => b.total_number_of_comments - a.total_number_of_comments);

    // response (json)
    res.json({
        data: data
    })
})

/**  
* ?question 2
* * post method
* @param post_id (optional)
* @param id (optional)
* @param email (optional)
* @param name (optional)
* @param body (optional)

*/
app.post("/filter_comments", async (req, res) => {
    let comment = {};
    let data = [];

    // set param
    let param = req.body;
    let post_id = param.post_id ? param.post_id : undefined;
    let id = param.id ? param.id : undefined;
    let name = param.name ? param.name : undefined;
    let email = param.email ? param.email : undefined;
    let body = param.body ? param.body : undefined;

    // get comment data
    const options = {
        method: "GET",
        uri: "https://jsonplaceholder.typicode.com/comments",
        json: true,
        headers: {
            "Content-Type": "application/json",
        },
    };

    await request(options)
        .then(function (response) {
            comment = response;
        })
        .catch(function (err) {
            console.log(err);
        });


    // filter all param
    function filter_post_id(comment) {
        return post_id !== undefined ? comment.postId == post_id : true
    }

    function filter_id(comment) {
        return id !== undefined ? comment.id == id : true
    }

    function filter_name(comment) {
        let temp = true;
        name !== undefined ? temp=false : temp=true;

        if (temp == false){
            var re = new RegExp(name,'gi')
            return comment.name.match(re);
        }else{
            return true;
        }
    }

    function filter_email(comment) {
        return email !== undefined ? comment.email == email : true
    }

    function filter_body(comment) {
        let temp = true;
        body !== undefined ? temp=false : temp=true;

        if (temp == false){
            var re = new RegExp(body,'gi')
            return comment.body.match(re);
        }else{
            return true;
        }
    }

    // main filter function
    data = comment.filter(filter_post_id)
        .filter(filter_id)
        .filter(filter_name)
        .filter(filter_email)
        .filter(filter_body);

    // response (json)
    res.json({
        data: data
    })
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
})