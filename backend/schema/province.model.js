import mongoose from "mongoose";

const ProvinceSchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: Number, required: true },
    codename: { type: String, required: true },
    division_type: { type: String, required: true },
    phone_code: { type: Number, required: true },
    districts: [
        {
            name: { type: String, required: true },
            code: { type: Number, required: true },
            codename: { type: String, required: true },
            division_type: { type: String, required: true },
            short_codename: { type: String, required: true },
            ward: [
                {
                    name: { type: String, required: true },
                    code: { type: Number, required: true },
                    codename: { type: String, required: true },
                    division_type: { type: String, required: true },
                    short_codename: { type: String, required: true }
                }
            ]
        }
    ]
}, { collection: 'tinh-thanh', timestamps: false, versionKey: false});

export default mongoose.model('tinh-thanh', ProvinceSchema);