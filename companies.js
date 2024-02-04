const express = require("express");
const router=express.Router();
const db = require("../db")

router.get('/', async (req, res, next)=>{
    try{
    const results=await db.query(`SELECT * FROM companies`)
    return res.status(200).json({companies: results.rows})
    }catch(e){
        return next(e)
    }
})

router.get('/:code', async(req, res, next)=>{
    try{
        const {code}=req.params
        const result = await db.query(
            'SELECT c.code, c.name, c.description, i.id, i.comp_code, i.amt, i.paid, i.add_date, i.paid_date ' +
            'FROM companies AS c LEFT JOIN invoices AS i ON (c.code = i.comp_code) ' +
            'WHERE c.code = $1',
            [code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`,404);
        }
        const companyData = {
            code: result.rows[0].code,
            name: result.rows[0].name,
            description: result.rows[0].description,
            invoices: []
        };
        result.rows.forEach(row => {
            if (row.id) {
                companyData.invoices.push({
                    id: row.id,
                    comp_code: row.comp_code,
                    amt: row.amt,
                    paid: row.paid,
                    add_date: row.add_date,
                    paid_date: row.paid_date
                });
            }
        });
        const responseObject = { company: companyData };
        return res.status(200).json(responseObject);
    }catch(e){
        return next(e)
    }
})

router.post('/', async(req, res, next)=>{
    try{
        const {code, name, description}=req.body;
        const result = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3)', [code, name, description]);
        return res.status(201).json({company: result.rows})
    }catch(e){
        return next(e);
    }
})

router.put('/:code', async(req, res, next)=>{
    try{
        const {name, description} = req.body;
        const result = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description)', [name, description])
        return res.status(200).json({company: result.rows[0]});
    }catch(e){
        return next(e);
    }
})

router.delete('/:code', async(req, res, next)=>{
    try{
        const {code} = req.params;
        result=await db.query('DELETE FROM companies WHERE code=$1', [code])
        return res.json({status: "Deleted"});
    }catch(e){
        return next(e);
    }
})

module.exports= cRoutes;