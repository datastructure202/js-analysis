const esprima = require('esprima');
const fs = require('fs');


const readFile = f => new Promise((resolve,reject) =>
    fs.readFile(f,'utf-8', (e,d) => e ? reject(e) : resolve(d) ) )


const variableDec = []
const functionExp = []
const content     = {}
const allLinks    = []
const contentFirstParty = {}
const LinksFirstParty = []

const getURL = href => {
    var l = document.createElement("a");
    l.href = href;
    return l;
};
const getIdentifiers = tree => {

    main_url = new URL(tree.log.pages[0].title)

    Object.keys(tree).forEach(a => {
        Object.keys(tree[a]).forEach(b => {
            if (b == "entries"){
                Object.keys(tree[a][b]).forEach(c => {
                    allLinks.push(tree[a][b][c].request.url)
                    cur_url = new URL(tree[a][b][c].request.url);
                    if (tree[a][b][c].response.headers.filter(a => a.name === "content-type").length) {
                        ext = tree[a][b][c].response.headers.filter(a => a.name === "content-type")
                        // console.log(ext)
                        if (Object.prototype.hasOwnProperty.call(content,ext[0].value)){
                            content[ext[0].value] += 1 
                            if (main_url.hostname === cur_url.hostname){
                                contentFirstParty[ext[0].value] += 1
                                LinksFirstParty.push(tree[a][b][c].request.url)
                            }
                        } else {
                            content[ext[0].value] = 1
                            if (main_url.hostname === cur_url.hostname){
                                contentFirstParty[ext[0].value] = 1
                                LinksFirstParty.push(tree[a][b][c].request.url)
                            }
                        }
                    }
                })
            }
        })
    })
}



const main = async () => {
    try{   
        const args = process.argv;
        if (args.length < 2) {
            console.log("Error: node parseHar.js [har filename]")
        }
        filename = args[2];

        tree = await readFile(filename);
		var tokens = JSON.parse(tree);
        getIdentifiers(tokens);

        //Print First Party Content BreakDown
        console.log(contentFirstParty);

        //print All Content BreakDown
        // console.log(content);
        
        //Print all First Party Links
        // console.log(LinksFirstParty);

        //Print all Links
        // console.log(Links);
        
    } catch (err){
        console.log(err)
    }
}


main()
