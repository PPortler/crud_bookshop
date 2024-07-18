import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
    {
        title:String,
        description:String,
        url:String
    },
    {
        timestamps: true
    }
)

const Books = mongoose.models.Books || mongoose.model("Books", bookSchema);
export default Books