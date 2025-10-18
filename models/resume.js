import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        pesonalInfo:{
            fullname: String,
            email: String,
            phone: String,
            address: String,
            linkedin: String,
            github: String,
        },
        education:[
            {
                degree: String,
                institution: String,
                year: String,
                grade: String,
            },
        ],
        experience:[
            {
                company: String,
                position: String,
                duration: String,
                description: String,
            },
        ],
        projects: [
            {
                title: String,
                description: String,
                techStack: [String],
            },
        ],
        skills: [String],
        achievements: [String],
    },
    {timestamps: true}
);

export default mongoose.model("Resume",resumeSchema);