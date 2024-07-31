const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/experience_db",{
    useNewUrlParser: true,
   useUnifiedTopology: true
})
