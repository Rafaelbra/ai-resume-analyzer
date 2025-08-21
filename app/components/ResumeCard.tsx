import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";



function ResumeCard({ resume : {id, companyName, jobTitle, feedback, imagePath} } : { resume: Resume }) {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');


    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }
        loadResume();
    }, [imagePath]);

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-100">
            <div className='resume-card-header'>
                <div className="flex flex-col gap-2">
                    <h2 className="text-black font-bold - break-words">
                        {companyName}
                    </h2>
                    <h3 className="text-lg break-words text-gray-500">
                        {jobTitle}
                    </h3>
                </div>
                <div className='flex-shrink-0'>
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            <div className='gradient-border animate-in fade-in duration-100'>
                <div className='w-full h-full'>
                    <img
                        src={imagePath}
                        alt="resume"
                        className="w-full h-[350px] max-sm:h[200px] object-cover object-top"
                    />
                </div>
            </div>

        </Link>
    )
}

export default ResumeCard