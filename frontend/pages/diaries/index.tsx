
import React, { useEffect, useState } from 'react';
// For rich text editor, install: npm install react-quill
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { FaPlusCircle, FaBookOpen } from 'react-icons/fa';
import Image from 'next/image';
import { getInternProfile, getInternCredits, getDiaries, createDiary, addDiaryEntry } from '../../utils/api';

// Type definitions
type InternProfile = {
  name: string;
  email: string;
  imageUrl?: string;
  badge?: string;
  credits: number;
  completion: number;
};

type DiaryEntry = {
  day: string;
  time: string;
  location: string;
  diseaseDescription: string;
  symptoms: string;
  doctorReference: string;
  imageUrl?: string;
  dataSource: string;
  gender: string;
  content: string;
  tags: string[];
  feedback?: string[];
  likes?: number;
  comments?: { user: string; text: string }[];
  symptomsChecklist?: string[];
};

type Diary = {
  id: string;
  title: string;
  entries: DiaryEntry[];
};

const DiariesPage: React.FC = () => {
  const [profile, setProfile] = useState<InternProfile | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [showCreateDiary, setShowCreateDiary] = useState(false);
  const [showCreateEntry, setShowCreateEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [newDiaryTitle, setNewDiaryTitle] = useState('');
  const [newEntryDay, setNewEntryDay] = useState('');
  const [newEntryTime, setNewEntryTime] = useState('');
  const [newEntryLocation, setNewEntryLocation] = useState('');
  const [newEntryDiseaseDescription, setNewEntryDiseaseDescription] = useState('');
  const [newEntrySymptoms, setNewEntrySymptoms] = useState('');
  const [newEntryDoctorReference, setNewEntryDoctorReference] = useState('');
  const [newEntryImageUrl, setNewEntryImageUrl] = useState('');
  const [newEntryDataSource, setNewEntryDataSource] = useState('');
  const [newEntryGender, setNewEntryGender] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [newEntryTags, setNewEntryTags] = useState<string[]>([]);
  const [newEntrySymptomsChecklist, setNewEntrySymptomsChecklist] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    // Hardcoded sample data for frontend testing
    setProfile({
      name: 'Dr. Anushka Sharma',
      email: 'anushka.sharma@medinternia.com',
      imageUrl: '/public/ram.jpg',
      badge: 'Verified Intern',
      credits: 120,
      completion: 80,
    });
    setCredits(120);
    setDiaries([
      {
        id: '1',
        title: 'Remote Internship at Rural Clinic',
        entries: [
          {
            day: '1',
            time: '08:30 AM',
            location: 'Rural Clinic, Village A',
            diseaseDescription: 'Fever, cough, dehydration',
            symptoms: 'High temperature, persistent cough, dry mouth',
            doctorReference: 'Dr. S. Kumar',
            imageUrl: '',
            dataSource: 'Clinic',
            gender: 'Female',
            content: 'Arrived at the rural clinic. Faced issues with limited medical supplies. Noticed common symptoms: fever, cough, and dehydration among patients.',
            tags: ['Fever', 'Rural Health'],
            feedback: ['Good observation. Try to note vital signs next time.'],
            likes: 2,
            comments: [{ user: 'Dr. R. Mehta', text: 'Well done!' }],
            symptomsChecklist: ['Fever', 'Cough', 'Dehydration'],
          },
          {
            day: '2',
            time: '09:00 AM',
            location: 'Village B',
            diseaseDescription: 'Malaria, skin infections',
            symptoms: 'Chills, rashes, itching',
            doctorReference: 'Dr. S. Kumar',
            imageUrl: '',
            dataSource: 'Clinic',
            gender: 'Male',
            content: 'Visited nearby villages. Area issues include lack of clean water and poor sanitation. Treated cases of malaria and skin infections.',
            tags: ['Malaria', 'Sanitation'],
            feedback: ['Document water sources next time.'],
            likes: 1,
            comments: [],
            symptomsChecklist: ['Chills', 'Rashes'],
          }
        ]
      },
      {
        id: '2',
        title: 'Urban Hospital Internship',
        entries: [
          {
            day: '1',
            time: '10:00 AM',
            location: 'City Hospital',
            diseaseDescription: 'Trauma, emergency cases',
            symptoms: 'Bleeding, fractures',
            doctorReference: 'Dr. R. Mehta',
            imageUrl: '',
            dataSource: 'Hospital',
            gender: 'Other',
            content: 'Orientation and introduction to hospital staff. Observed emergency cases and trauma patients.',
            tags: ['Trauma'],
            feedback: [],
            likes: 0,
            comments: [],
            symptomsChecklist: ['Bleeding', 'Fractures'],
          },
          {
            day: '2',
            time: '11:30 AM',
            location: 'City Hospital',
            diseaseDescription: 'Respiratory diseases',
            symptoms: 'Cough, shortness of breath',
            doctorReference: 'Dr. R. Mehta',
            imageUrl: '',
            dataSource: 'Hospital',
            gender: 'Female',
            content: 'Assisted in outpatient department. Noted high incidence of respiratory diseases due to pollution.',
            tags: ['Respiratory'],
            feedback: ['Track pollution data for correlation.'],
            likes: 3,
            comments: [{ user: 'Peer Intern', text: 'Interesting data!' }],
            symptomsChecklist: ['Cough', 'Shortness of breath'],
          }
        ]
      }
    ]);
  }, []);

  const handleCreateDiary = async () => {
    if (!newDiaryTitle) return;
    const diary: Diary = await createDiary(newDiaryTitle);
    setDiaries([...diaries, { ...diary, entries: [] }]);
    setShowCreateDiary(false);
    setNewDiaryTitle('');
  };

  const handleAddEntry = async () => {
    if (!selectedDiary || !newEntryDay || !newEntryTime || !newEntryLocation || !newEntryDiseaseDescription || !newEntrySymptoms || !newEntryDoctorReference || !newEntryDataSource || !newEntryGender || !newEntryContent) return;
    const entry: DiaryEntry = {
      day: newEntryDay,
      time: newEntryTime,
      location: newEntryLocation,
      diseaseDescription: newEntryDiseaseDescription,
      symptoms: newEntrySymptoms,
      doctorReference: newEntryDoctorReference,
      imageUrl: newEntryImageUrl,
      dataSource: newEntryDataSource,
      gender: newEntryGender,
      content: newEntryContent,
      tags: newEntryTags,
      symptomsChecklist: newEntrySymptomsChecklist,
    };
    setDiaries(
      diaries.map(d =>
        d.id === selectedDiary.id
          ? { ...d, entries: [...d.entries, entry] }
          : d
      )
    );
    setSelectedDiary({ ...selectedDiary, entries: [...selectedDiary.entries, entry] });
    setNewEntryDay('');
    setNewEntryTime('');
    setNewEntryLocation('');
    setNewEntryDiseaseDescription('');
    setNewEntrySymptoms('');
    setNewEntryDoctorReference('');
    setNewEntryImageUrl('');
    setNewEntryDataSource('');
    setNewEntryGender('');
    setNewEntryContent('');
  };


  return (
    <div style={{ background: '#eaf2fb', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 1000, margin: '40px auto', background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px #b3c6e0', padding: '2.5rem 2rem' }}>
        {/* Daily Diaries Heading */}
        <h1 style={{ fontWeight: 700, fontSize: 28, color: '#2176ae', marginBottom: 18 }}>Daily Diaries</h1>
        {/* Streak, Leaderboard, Credit Rewards to the right of profile, with icons */}
        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image src={profile.imageUrl || '/assets/p1.png'} alt="Profile" width={60} height={60} style={{ borderRadius: '50%' }} />
              <div style={{ marginLeft: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#2176ae' }}>{profile.name} <span style={{ background: '#e0f7fa', color: '#0070f3', borderRadius: 8, padding: '2px 8px', fontSize: 14, marginLeft: 8 }}>{profile.badge}</span></div>
                <div style={{ color: '#555', fontSize: 16 }}>{profile.email}</div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 600, color: '#2176ae', fontSize: 15 }}>Credits: <span style={{ color: '#0070f3', fontWeight: 700 }}>{profile.credits}</span></div>
                  <div style={{ marginTop: 4, width: 200, background: '#eaf2fb', borderRadius: 8, height: 12 }}>
                    <div style={{ width: `${profile.completion}%`, background: '#2176ae', height: 12, borderRadius: 8 }}></div>
                  </div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Internship Completion: {profile.completion}%</div>
                </div>
                <div style={{ marginTop: 8, fontSize: 14, color: '#555' }}>
                  <b>Stats:</b> Diaries: {diaries.length}, Days Logged: {diaries.reduce((a, d) => a + d.entries.length, 0)}, Avg Entries/Week: {Math.round(diaries.reduce((a, d) => a + d.entries.length, 0) / 2)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 18 }}>
              <div style={{ background: '#f7fbff', borderRadius: 12, padding: 16, minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <FaBookOpen size={28} color="#2176ae" style={{ marginBottom: 6 }} />
                <span style={{ color: '#2176ae', fontWeight: 700, fontSize: 15 }}>7 days</span>
                <span style={{ color: '#888', fontSize: 13 }}>Streak</span>
              </div>
              <div style={{ background: '#f7fbff', borderRadius: 12, padding: 16, minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <FaPlusCircle size={28} color="#2176ae" style={{ marginBottom: 6 }} />
                <span style={{ color: '#2176ae', fontWeight: 700, fontSize: 15 }}>#3</span>
                <span style={{ color: '#888', fontSize: 13 }}>Leaderboard</span>
              </div>
              <div style={{ background: '#f7fbff', borderRadius: 12, padding: 16, minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <FaPlusCircle size={28} color="#2176ae" style={{ marginBottom: 6 }} />
                <span style={{ color: '#2176ae', fontWeight: 700, fontSize: 15 }}>+10</span>
                <span style={{ color: '#888', fontSize: 13 }}>Credits</span>
              </div>
            </div>
          </div>
        )}
        {/* Search & Filter */}
        <div style={{ marginBottom: 24 }}>
          <input type="text" placeholder="Search diaries, tags, symptoms..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: 300, padding: 8, borderRadius: 8, border: '1px solid #b3c6e0', marginRight: 12 }} />
          <button style={{ background: '#2176ae', color: '#fff', borderRadius: 8, padding: '8px 18px', border: 'none', fontWeight: 600 }}>Export PDF</button>
        </div>
        {/* Diary List with Timeline View */}
        {!selectedDiary ? (
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 22, color: '#2176ae', marginBottom: 18 }}>Diaries Timeline</h2>
            {diaries.length === 0 ? <div>No diaries yet.</div> : (
              diaries.map(diary => (
                <div key={diary.id} style={{ background: '#f7fbff', borderRadius: 16, boxShadow: '0 2px 8px #dbeafe', padding: 20, marginBottom: 28 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#2176ae', marginBottom: 10 }}>{diary.title}</div>
                  {/* Show only days */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {diary.entries.map(entry => (
                      <button key={entry.day + entry.time} onClick={() => setSelectedEntry(entry)} style={{ background: '#2176ae', color: '#fff', borderRadius: 8, padding: '12px 18px', border: 'none', fontWeight: 600, fontSize: 16, minWidth: 120, cursor: 'pointer' }}>
                        Day {entry.day}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => { setSelectedDiary(diary); setShowCreateEntry(true); }} style={{ background: '#0070f3', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '8px 22px', border: 'none', boxShadow: '0 2px 8px #b3c6e0', cursor: 'pointer', marginTop: 18 }}>Add Entry</button>
                </div>
              ))
            )}
          </div>
        ) : (
          selectedDiary && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: '#2176ae', marginBottom: 18 }}>{selectedDiary.title}</h2>
                <div>
                  {selectedDiary.entries && selectedDiary.entries.length === 0 ? (
                    <div>No entries yet.</div>
                  ) : (
                    selectedDiary.entries && selectedDiary.entries.map((entry: any) => (
                      <div key={entry.day + entry.time} style={{ background: '#f7fbff', borderRadius: 12, boxShadow: '0 2px 8px #dbeafe', padding: 16, marginBottom: 14 }}>
                        <div style={{ fontWeight: 700, color: '#2176ae', fontSize: 16 }}>Day {entry.day} <span style={{ color: '#888', fontWeight: 400, fontSize: 14 }}>({entry.time})</span></div>
                        <div style={{ marginTop: 8, color: '#333', fontSize: 15 }}><b>Location:</b> {entry.location}</div>
                        <div style={{ color: '#333', fontSize: 15 }}><b>Disease Description:</b> {entry.diseaseDescription}</div>
                        <div style={{ color: '#333', fontSize: 15 }}><b>Symptoms:</b> {entry.symptoms}</div>
                        <div style={{ color: '#333', fontSize: 15 }}><b>Doctor Reference:</b> {entry.doctorReference}</div>
                        {entry.imageUrl && (
                          <div style={{ margin: '8px 0' }}>
                            <Image src={entry.imageUrl} alt="Entry Image" width={120} height={80} style={{ borderRadius: 8 }} />
                          </div>
                        )}
                        <div style={{ color: '#333', fontSize: 15 }}><b>Gender:</b> {entry.gender}</div>
                        <div style={{ color: '#333', fontSize: 15 }}><b>Data Source:</b> {entry.dataSource}</div>
                        <div style={{ marginTop: 8, color: '#333', fontSize: 15 }}><b>Notes:</b> {entry.content}</div>
                      </div>
                    ))
                  )}
                </div>
                {/* Overlay for Add Entry */}
                {showCreateEntry && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowCreateEntry(false)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '32px 32px 24px 32px', minWidth: 380, maxWidth: 500, boxShadow: '0 4px 24px #b3c6e0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                      <h3 style={{ fontWeight: 700, fontSize: 22, color: '#2176ae', marginBottom: 18 }}>Add Entry</h3>
                      <div style={{ width: '100%' }}>
                        <input type="text" placeholder="Day (e.g. 1, 2, 3)" value={newEntryDay} onChange={e => setNewEntryDay(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                        <input type="text" placeholder="Time (e.g. 08:30 AM)" value={newEntryTime} onChange={e => setNewEntryTime(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                        <input type="text" placeholder="Location Description" value={newEntryLocation} onChange={e => setNewEntryLocation(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                        <input type="text" placeholder="Disease Description" value={newEntryDiseaseDescription} onChange={e => setNewEntryDiseaseDescription(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                        <input type="text" placeholder="Symptoms" value={newEntrySymptoms} onChange={e => setNewEntrySymptoms(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                        <input type="text" placeholder="Doctor Reference" value={newEntryDoctorReference} onChange={e => setNewEntryDoctorReference(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                        <input type="text" placeholder="Image URL (optional)" value={newEntryImageUrl} onChange={e => setNewEntryImageUrl(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                        <input type="text" placeholder="Data Source (Hospital, NGO, etc.)" value={newEntryDataSource} onChange={e => setNewEntryDataSource(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                        <input type="text" placeholder="Gender (Male, Female, Other, Custom)" value={newEntryGender} onChange={e => setNewEntryGender(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                        <textarea placeholder="Notes / Additional Details" value={newEntryContent} onChange={e => setNewEntryContent(e.target.value)} style={{ width: '100%', marginBottom: 12, minHeight: 80, padding: 10, borderRadius: 8, border: '1px solid #b3c6e0', fontSize: 15 }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 8, width: '100%' }}>
                        <button onClick={() => { handleAddEntry(); setShowCreateEntry(false); }} style={{ background: '#2176ae', color: '#fff', fontWeight: 700, fontSize: 17, borderRadius: 8, padding: '10px 32px', border: 'none', boxShadow: '0 2px 8px #b3c6e0', cursor: 'pointer', transition: 'background 0.2s' }}>Add Entry</button>
                        <button onClick={() => { setShowCreateEntry(false); }} style={{ background: '#eaf2fb', color: '#2176ae', fontWeight: 700, fontSize: 17, borderRadius: 8, padding: '10px 32px', border: 'none', boxShadow: '0 2px 8px #b3c6e0', cursor: 'pointer', transition: 'background 0.2s' }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          )
        )}
        <>
          {/* Overlay for Day Details */}
          {selectedEntry && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedEntry(null)}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 350, maxWidth: 500, boxShadow: '0 4px 24px #b3c6e0', position: 'relative' }} onClick={e => e.stopPropagation()}>
                <h3 style={{ fontWeight: 700, fontSize: 22, color: '#2176ae', marginBottom: 12 }}>Day {selectedEntry.day} Details</h3>
                <div style={{ color: '#333', fontSize: 15 }}><b>Time:</b> {selectedEntry.time}</div>
                <div style={{ color: '#333', fontSize: 15 }}><b>Location:</b> {selectedEntry.location}</div>
                <div style={{ color: '#333', fontSize: 15 }}><b>Disease Description:</b> {selectedEntry.diseaseDescription}</div>
                <div style={{ color: '#333', fontSize: 15 }}><b>Symptoms:</b> {selectedEntry.symptoms}</div>
                <div style={{ color: '#333', fontSize: 15 }}><b>Tags:</b> {selectedEntry.tags.join(', ')}</div>
                <div style={{ color: '#333', fontSize: 15 }}><b>Doctor Reference:</b> {selectedEntry.doctorReference}</div>
                <div style={{ color: '#333', fontSize: 15 }}><b>Gender:</b> {selectedEntry.gender}</div>
                <div style={{ color: '#333', fontSize: 15 }}><b>Data Source:</b> {selectedEntry.dataSource}</div>
                <div style={{ color: '#333', fontSize: 15 }}><b>Symptom Checklist:</b> {selectedEntry.symptomsChecklist?.join(', ')}</div>
                {selectedEntry.imageUrl && (
                  <div style={{ margin: '8px 0' }}>
                    <Image src={selectedEntry.imageUrl} alt="Entry Image" width={120} height={80} style={{ borderRadius: 8 }} />
                  </div>
                )}
                <div style={{ marginTop: 8, color: '#333', fontSize: 15 }}><b>Notes:</b> {selectedEntry.content}</div>
                <div style={{ marginTop: 8 }}>
                  <b>Mentor Feedback:</b> {selectedEntry.feedback?.map((f, i) => <span key={i} style={{ background: '#e0f7fa', color: '#2176ae', borderRadius: 8, padding: '2px 8px', marginRight: 6 }}>{f}</span>)}
                </div>
                <div style={{ marginTop: 8 }}>
                  <b>Likes:</b> {selectedEntry.likes || 0} <b>Comments:</b> {selectedEntry.comments?.length || 0}
                  <div style={{ marginTop: 4 }}>
                    {selectedEntry.comments?.map((c, i) => (
                      <div key={i} style={{ fontSize: 13, color: '#555', marginBottom: 2 }}><b>{c.user}:</b> {c.text}</div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setSelectedEntry(null)} style={{ marginTop: 18, background: '#2176ae', color: '#fff', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '8px 22px', border: 'none', cursor: 'pointer' }}>Close</button>
              </div>
            </div>
          )}
    <div>
      {/* Charts & Analytics Placeholder */}
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <h4 style={{ fontWeight: 700, fontSize: 18, color: '#2176ae', marginBottom: 10 }}>Charts & Analytics (Coming Soon)</h4>
        <div style={{ background: '#f7fbff', borderRadius: 12, padding: 24, color: '#888' }}>
          Symptom trends, location-based health issues, etc.
        </div>
      </div>
      {/* Map View Placeholder */}
            <button onClick={handleCreateDiary} style={{ background: '#2176ae', color: '#fff', padding: '10px 24px', borderRadius: 8, fontWeight: 600, fontSize: 16, border: 'none', marginTop: 8 }}>Create</button>
        </div>
        </>
        </div>
    </div>
  );
};

export default DiariesPage;
