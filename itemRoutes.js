const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError");
const items = require("./fakeDb")

router.get("/", (req, res)=> {
    return res.json(items)
});

router.post("/", (req, res, next)=>{
    let name = req.body.name;
    let price = req.body.price;
    try{
        if(!name) throw new ExpressError("Name is required", 400);
        if(!price) throw new ExpressError("Price is required", 400);
        const newItem = { name, price };
        items.push(newItem);
        return res.status(201).json({"added": newItem})

    } catch(e){
        return next(e)
    }
});

router.get("/:name", (req, res) => {
    const foundItem =items.find(item => item.name === req.params.name);
    if(foundItem === undefined){
        throw new ExpressError(`Item ${req.params.name} not found`, 404)
    };
    return res.json(foundItem)
});

router.patch("/:name", (req, res)=> {
    const foundItem = items.find(item=> item.name === req.params.name);
    if(foundItem === undefined){
        throw new ExpressError(`Item ${req.params.name} not found`, 404)
    };
    foundItem.name = req.body.name || foundItem.name;
    foundItem.price = req.body.price || foundItem.price;
    return res.json({updated: foundItem})
});

router.delete("/:name", (req, res)=> {
    const foundItem = items.findIndex(item => item.name === req.params.name);
    if(foundItem === -1){
        throw new ExpressError(`Item ${req.params.name} not found`, 404);
    };
    items.splice(foundItem, 1);
    return res.json({message: "Deleted"})
});

module.exports = router;