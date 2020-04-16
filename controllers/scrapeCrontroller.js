const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
    pop: async (req, res) =>  {
        console.log(req.body.item_name)
        const query_items = req.body.item_name.split(" ")
        console.log(query_items)
        
        let query = "";
        for (let i = 0; i < query_items.length; i ++) { 
          if (i === query_items.length - 1){ 
            query += query_items[i] 
          }
          else{
            query += query_items[i] + "+"
          }
        }
        const remove_linebreaks = ( str ) => { 
            
            str =  str.replace( /[\r\n]+/gm, "&" ); 
            str =  str.replace(/[\s]+/gm, " ")
            return str.split("&")
        } 
        let amazon_base_query = "https://www.amazon.com/s?k=" + query
        let ebay_base_query = `https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR12.TRC2.A0.H0.X${query}.TRS0&_nkw=${query}&_sacat=0`
        let ebay_data = []
        let amazon_data = []
        await axios.get(ebay_base_query)
            .then(function(response) {
          // $ebay for a shorthand selector for ebay data
                let $ebay = cheerio.load(response.data);
                $ebay("#srp-river-results ul li.s-item").each(function(i, element) {
                    let results = {
                        item_name: "",
                        item_price: ""
                        // item_link: "",
                        // item_img: ""
                    }
                    $ebay(this)
                        .children("div.s-item__wrapper")
                        .children("div.s-item__info")
                        .children("div.s-item__details")
                        .children("div.s-item__detail").each(function(i, element){
                            results.item_price = $ebay(this).children("span").text()
                            return false
                            
                        })
                        .children("span.s-item__price")
                        .text()

                    results.item_name = $ebay(this)
                        .children("div.s-item__wrapper")
                        .children("div.s-item__info")
                        .children("a.s-item__link")
                        .text()

                    ebay_data.push(results)
                    
                })

            })
            .catch(function(err){
                console.log(err)
            })
        
        await axios.get(amazon_base_query)
            .then(function(response) { 
                let $amazon = cheerio.load(response.data);
                console.log("getting amazon")
                $amazon("div.s-matching-dir div.sg-col-inner span[data-component-type|='s-search-results'] div.s-result-list div.s-result-item").each(function(i, element) {
                    let amazon = []
                    $amazon(this)
                        .children("div.sg-col-inner")
                        .children("span.celwidget")
                        .children("div")
                        .children("div.a-section").each(function(i, element) { 
                            let str = (remove_linebreaks($amazon(this).text()))
                            for (let i = 0; i < str.length; i ++){ 
                                if (str[i] !== " "){ 
                                    amazon.push(str[i])

                                }
                            }
                        })
                        
                    //     
                    //     
                    //     .children("div.a-section").each(function(i, element) { 
                    //         console.log("i,element")
                    //     })
                    // ama ++;
                    if (amazon[1] === " Best Seller"){
                        let cleaned = {
                            item_name : "",
                            item_price : ""
                        }
                        for (let i = 0; i < amazon.length; i ++) { 
                            if (amazon[i][1] >= "0" && amazon[i][1]<= "9"){
                                cleaned.item_name = amazon[i-2] + ", " + amazon[i-1] 
                                break
                            }else if(amazon[i][1] === "$"){
                                cleaned.item_name = amazon[i-2] + ", " + amazon[i-1] 
                                break
                            }
                            
                        }
                        for (let i = 0; i < amazon.length; i ++) { 
                            if (amazon[i][1] === "$" && amazon[i+1][1] === "$"){
                                cleaned.item_price = "$"+amazon[i].split("$")[1]
                                cleaned.item_price_1 = "$"+amazon[i+1].split("$")[1]
                                break
                                
                            }
                            else if(amazon[i][1] === "$"){
                                cleaned.item_price = "$"+amazon[i].split("$")[1]
                                break
                            }
                        }
                        amazon_data.push(cleaned)
                        console.log(amazon)
                        console.log(cleaned)
                        
                    }

                })
                    // .children("span[cel_widget_id|='SEARCH_RESULTS-SEARCH_RESULTS']")
                    // .children("div.s-expand-height")
                
                
            })
            .catch(function(err){
                console.log(err)
            })

        
        res.json({amazon: amazon_data[0], ebay: ebay_data[1]});
        
    }
      
}

