var mongoose = require("mongoose");

const rationSchema = new mongoose.Schema(
  {
    packet_id: {
      type: String,
      unique: true
    },
    packet_type: {
      type: String
    },
    packet_content: {
      type: String
    },
    calories: {
      type: Number
    },
    expiry_date: {
      type: Date
    },
    quantity_in_litres: {
      type: Number
    }
  }
);

let ration = mongoose.model("ration", rationSchema);

insertOne = async (query) => {
    try{
        const create = await ration(query).save();
        return create;
    }catch (err) {
        return err
    }
}

find = async (query) => {
  try{
      const get = await ration.find(query);
      return get
  }catch (err) {
      return err
  }
}

sort_ration = async (query) => {
  try{
      const get = await ration.aggregate([
        {
          '$sort': {
            'expiry_date': 1
          }
        }
      ]);
      return get
  }catch (err) {
      return err
  }
}



updateOne = async (match, query) => {
  try{
      const set = await  ration.updateOne(match, query)
      return set
  }catch (err) {
      return err
  }
}

deleteOne = async (query) => {
  try{
      const set = await  ration.deleteOne(query);
      return set
  }catch (err) {
      return err
  }
}



module.exports = {
  insertOne,
  find,
  updateOne,
  deleteOne,
  sort_ration
}