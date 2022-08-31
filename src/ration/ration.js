const express = require('express');
const router = express.Router();
const { ObjectId } = require("mongodb");
const logger = require('../../config/logger');
const ration = require("../../models/ration");

/* add ration*/ 
router.post('/', async(req, res, next) => {
    try 
    {
        let create = await ration.insertOne(req.body);
        if(create.packet_id){
            res.status(200).send({status: true, statusCode: 200, message: "ration added successfully..."});
        }
        else{
            res.status(400).send({status: false, statusCode: 400, err: create});
        }
    }
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}); 
    }
});

/* get ration*/
router.get('/', async(req, res, next) => {
    try 
    {
        let get = await ration.find();
        res.status(200).send({status: true, statusCode: 200, data:get})
    }
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}) 
    }
});

/*get offer_by_id*/
router.get('/offer_by_id', async(req, res, next) => {
    try 
    {
        let get = await ration.findOne({_id: req.query._id});
        res.status(200).send({status: true, statusCode: 200, data:get})
    }
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}) 
    }
});

/* update offer */
router.patch('/', async(req, res, next) => {
    try 
    {
        let get = await ration.updateOne({_id:ObjectId(req.body._id)},req.body);
        if(get.acknowledged){
            res.status(200).send({status: true, statusCode: 200, message: "ration updated successfully."})
        }
        else{
            res.status(400).send({status: false, statusCode: 400, data:get})
        }
    }
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}) 
    }
});

/* delete offer */
router.delete('/', async(req, res, next) => {
    try 
    {
        let get = await ration.updateOne({_id: req.query._id}, req.query);

        if(get.acknowledged){
            res.status(200).send({status: true, statusCode: 200, message: "ration deactivated successfully."})
        }
        else{
            res.status(200).send({status: false, statusCode: 400, data:get})
        }
    }
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}) 
    }
});

//sort_ration
router.get('/sort_ration', async(req, res, next) => {
    try 
    {
        let get = await ration.sort_ration();
        // console.log(get)
        

        const findAllSubsets = (arr = []) => {
            arr.sort();
            const res = [[]];
            let count, subRes, preLength;
            for (let i = 0; i < arr.length; i++) {
               count = 1;
               while (arr[i + 1] && arr[i + 1] == arr[i]) {
                  count += 1;
                  i++;
               }
               preLength = res.length;
               for (let j = 0; j < preLength; j++) {
                  subRes = res[j].slice();
                  for (let x = 1; x <= count; x++) {
                     if (x > 0) subRes.push(arr[i]);
                     res.push(subRes.slice());
                  }
               }
            };
            return res;
         };
        let consume =[0,0,0,0,0,0,0];

        var today="2019/05/05";
        var start="2019/05/05";

        const endOfDay = () =>{
            var sum=0;
            for(let i=0;i<consume.length; i++){
                if(consume[i]==0){
                    sum+=calories[i];
                }
            }
            console.log("sum",sum)
            if(sum>=2500){
                return false;
            }
            return true;
        }

        while(true){
            var totalCalories= 0;
            for(let i=0; i<consume.length; i++){
                if(expiry[i]==today && consume[i]!=1){
                    consume[i]=1;
                    totalCalories+=calories[i];
                }
            }
            console.log("today",today,"totalCal",totalCalories)
            if(totalCalories>2500){
                today=today+1;
                let end = endOfDay();
                if(end){
                    break;
                }
                continue;
            }
            var remaining=[];
            var index=[]
            for(let i=0; i<consume.length; i++){
                if(consume[i]==0){

                    remaining.push(calories[i]);
                    index.push(consume[i]);
                }
            }
            console.log("remaining",remaining)
            var temp =findAllSubsets(remaining);
            console.log("temp",temp);
            var addition=0;
            var minimum=999999;
            var currTempArr=temp[0];
            for(let i=0; i<temp.length; i++){
                tempList=temp[i];
                addition=tempList.reduce((a, b) => a + b, 0);
                if(addition+totalCalories>=2500 && addition<minimum){
                    minimum= addition;
                    currTempArr=tempList;
                }
            }
            addition=minimum;
            console.log("addition",addition,"currTempArr",currTempArr)
            if(totalCalories + addition<2500){
                break;
            }
            for(let i=0; i<currTempArr.length; i++){
                for(let j=0; j<consume.length; j++){
                    if(calories[j]==currTempArr[i] && consume[j]!=1){
                        consume[j]=1;
                        console.log("consume",consume,"i",i)
                        break;
                    }
                }
            }
            console.log("consume",consume)
            console.log("calories",calories)
            today=today+1;
            console.log("today",today,"endOfDay",endOfDay())
            if(endOfDay()){
                break;
            }else{
                continue;
            }
        }

        var totalDays=today-start;
        //another function
        
        
         console.log(totalDays)
        res.status(200).send({status: true, statusCode: 200, data:totalDays})
    }
    catch(err)
    {
        logger.logEvents("Error", err.stack);
        res.status(400).send({status: false, statusCode: 400, message: err.message}) 
    }
});

module.exports = router;