import mongoose from "mongoose";

const userRegisterSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reservedBooks: [
        {
          
          libraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Library" },

          reservedAt: [
            { bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
              position:
                {
                  floor:{type:Number,require:true},
                  grid:{type:Number,require:true},
                  index:{type:Number,require:true},
              }
            ,
              date:{type: String,required:true},
              startTime:{type:String,required:true},
              endTime:{type:String,required:true},
            }]
        },
      ],
}, { timestamps: true });

const userRegisterModel = mongoose.models.userRegisterModel || mongoose.model("Register", userRegisterSchema);

export default userRegisterModel;
