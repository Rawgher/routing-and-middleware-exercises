const express = require("express")
const app = express();
const itemsRoutes = require("./routes/items")
const ExpressError = require("./expressError")
const morgan = require("morgan")

app.use(express.json());
app.use(morgan('dev'))
app.use("/items", itemsRoutes);

app.use(function (req, res, next) {
    return new ExpressError("Not Found", 404);
});

app.use((e, req, res, next) => {
    res.status(e.status || 500);
  
    return res.json({
      error: e.message,
    });
});
  
module.exports = app