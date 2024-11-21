import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firestore, storage, auth } from '../firebase/firebase';
import '../styles/CreateJob.css';
import Select from 'react-select';

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const skillsOptions = [
    { value: 'Java', label: 'Java' },
    { value: 'Python', label: 'Python' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'C++', label: 'C++' },
    { value: 'C#', label: 'C#' },
    { value: 'Go', label: 'Go' },
    { value: 'Swift', label: 'Swift' },
    { value: 'Kotlin', label: 'Kotlin' },
    { value: 'PHP', label: 'PHP' },
    { value: 'Ruby on Rails', label: 'Ruby on Rails' },
    { value: 'Vue.js', label: 'Vue.js' },
    { value: 'Angular', label: 'Angular' },
    { value: 'Bootstrap', label: 'Bootstrap' },
    { value: 'Tailwind CSS', label: 'Tailwind CSS' },
    { value: 'SASS', label: 'SASS' },
    { value: 'LESS', label: 'LESS' },
    { value: 'MySQL', label: 'MySQL' },
    { value: 'PostgreSQL', label: 'PostgreSQL' },
    { value: 'SQLite', label: 'SQLite' },
    { value: 'Oracle Database', label: 'Oracle Database' },
    { value: 'Microsoft SQL Server', label: 'Microsoft SQL Server' },
    { value: 'NoSQL Databases (e.g., Cassandra, CouchDB)', label: 'NoSQL Databases' },
    { value: 'AWS', label: 'AWS' },
    { value: 'Microsoft Azure', label: 'Microsoft Azure' },
    { value: 'Google Cloud Platform (GCP)', label: 'Google Cloud Platform' },
    { value: 'Heroku', label: 'Heroku' },
    { value: 'Git', label: 'Git' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Jenkins', label: 'Jenkins' },
    { value: 'Docker', label: 'Docker' },
    { value: 'Kubernetes', label: 'Kubernetes' },
    { value: 'Jest', label: 'Jest' },
    { value: 'Mocha', label: 'Mocha' },
    { value: 'Cypress', label: 'Cypress' },
    { value: 'Selenium', label: 'Selenium' },
    { value: 'Python (Scikit-learn, TensorFlow, PyTorch)', label: 'Python (Data Science)' },
    { value: 'R', label: 'R' },
    { value: 'Spark', label: 'Spark' },
    { value: 'Linux', label: 'Linux' },
    { value: 'API Development', label: 'API Development' },
    { value: 'Microservices', label: 'Microservices' },
];

const CreateJob = () => {
    const navigate = useNavigate();

    const [jobData, setJobData] = useState({
        jobName: '',
        jobDescription: '',
        jobType: '',
        location: '',
        department: '',
        applicationReleaseDate: getCurrentDate(),
        applicationDeadline: '',
        jobPicture: '',
        companyID: '',
        skills: [], // skills field eklendi
    });

    console.log(jobData);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setJobData((prevJobData) => ({ ...prevJobData, companyID: user.uid }));
            } else {
               
            }
        });

        // useEffect içinde abonelik oluşturduğumuz için bu aboneliği temizlemeliyiz.
        return () => unsubscribe();
    }, []);

    const [qualificationInput, setQualificationInput] = useState('');
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(false);

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleQualificationAdd = () => {
        setJobData({
            ...jobData,
            qualifications: [...jobData.qualifications, qualificationInput],
        });
        setQualificationInput('');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileError(false);
    };

    const handleSkillsChange = (selectedOptions) => {
        setJobData((prevJobData) => ({
            ...prevJobData,
            skills: selectedOptions.map(option => option.value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tüm alanların doldurulup doldurulmadığını kontrol edelim
        for (const key in jobData) {
            if (key === 'jobPicture' || key === 'applicationReleaseDate' || key === 'companyID') {
                continue;
            } else if (jobData[key] === '' || (Array.isArray(jobData[key]) && jobData[key].length === 0)) {
                alert('Please fill in all fields');
                return;
            }
        }

        if (!file) {
            setFileError(true);
            alert('Please upload a job picture');
            return;
        }

        try {
            const storageRef = ref(storage, `jobsPictures/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Error uploading file:', error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await addJob(downloadURL);
                }
            );
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };

    const addJob = async (pictureUrl) => {
        try {
            await addDoc(collection(firestore, 'jobs'), { ...jobData, jobPicture: pictureUrl, appliedApplications: [] });
            alert('Job posted successfully!');
            navigate('/');
        } catch (e) {
            console.error('Error adding job: ', e);
        }
    };

    const getMaxDate = () => {
        const today = new Date();
        today.setMonth(today.getMonth() + 6);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="create-job">
            <h2>Create Job</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="jobName"
                    placeholder="Job Name"
                    value={jobData.jobName}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="jobDescription"
                    placeholder="Job Description"
                    value={jobData.jobDescription}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="jobType"
                    placeholder="Job Type"
                    value={jobData.jobType}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={jobData.location}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={jobData.department}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="applicationDeadline"
                    min={getCurrentDate()}
                    max={getMaxDate()}
                    value={jobData.applicationDeadline}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    name="jobPicture"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
                {fileError && <p style={{ color: 'red' }}>Please upload a job picture</p>}
                <label>
                    Skills
                    <Select
                        name="skills"
                        value={skillsOptions.filter(option => jobData.skills.includes(option.value))}
                        onChange={handleSkillsChange}
                        options={skillsOptions}
                        isMulti
                        required
                    />
                </label>
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default CreateJob;
