const express = require("express");
const router=express.Router();
const db = require("../db")

router.get('/', async(req, res, next)=>{
    try{
        const results=await db.query(`SELECT * FROM invoices`)
        return res.status(200).json({invoices: results.rows})
        }catch(e){
            return next(e)
        }
})

router.get("/:id", async function (req, res, next) {
    try {
      let id = req.params.id;
  
      const result = await db.query(
            `SELECT i.id, 
                    i.comp_code, 
                    i.amt, 
                    i.paid, 
                    i.add_date, 
                    i.paid_date, 
                    c.name, 
                    c.description 
             FROM invoices AS i
               INNER JOIN companies AS c ON (i.comp_code = c.code)  
             WHERE id = $1`,
          [id]);
  
      if (result.rows.length === 0) {
        throw new ExpressError(`No such invoice: ${id}`,404);
      }
  
      const data = result.rows[0];
      const invoice = {
        id: data.id,
        company: {
          code: data.comp_code,
          name: data.name,
          description: data.description,
        },
        amt: data.amt,
        paid: data.paid,
        add_date: data.add_date,
        paid_date: data.paid_date,
      };
  
      return res.json({"invoice": invoice});
    }catch (err) {
      return next(err);
    }
});


router.post('/', async(req, res, next)=>{
    try{
        const {comp_code, amt}=req.body;
        const result = await db.query('INSERT INTO invoices (code, name, description) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt]);
        return res.status(201).json({invoice: result.rows})
    }catch(e){
        return next(e);
    }
})

router.put('/:id', async(req, res, next)=>{
    try{
        const { id } = req.params;
        const {amt} = req.body;
        const results = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date', [amt, id])
        const updatedInvoice=results.rows[0];
        return res.json({invoice: updatedInvoice})
    }catch(e){
        return next(e);
    }
})

router.delete('/:id', async(req, res, next)=>{
    try{
        const {id} = req.params
        const result = await db.query('DELETE FROM invoices WHERE =$1', [id]);
        return res.status(200).json({status:"Deleted"})
    }catch(e){
        return next(e);
    }
})

router.get('/companies/:code', async(req, res, next)=>{
    try{

    }
})

module.exports=iRoutes