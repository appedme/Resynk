export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Resume Writing Guide</h1>
      
      <div className="max-w-3xl mx-auto space-y-8">
        <Section 
          title="1. Contact Information"
          content="Include your full name, phone number, professional email, LinkedIn profile, and location (city, state)."
        />

        <Section
          title="2. Professional Summary"
          content="Write 2-3 sentences highlighting your key professional attributes, years of experience, and career goals."
        />

        <Section
          title="3. Work Experience"
          content={`• List positions in reverse chronological order
• Include company name, job title, dates of employment
• Use action verbs to describe achievements
• Quantify results where possible
• Focus on relevant experiences`}
        />

        <Section
          title="4. Education"
          content={`• List degrees, certifications, and relevant coursework
• Include graduation dates and GPA if above 3.5
• Mention academic honors and achievements`}
        />

        <Section
          title="5. Skills"
          content={`• List technical skills, software proficiency
• Include soft skills like leadership, communication
• Organize skills by categories
• Prioritize skills relevant to the job`}
        />

        <Section
          title="6. Formatting Tips"
          content={`• Keep to 1-2 pages
• Use consistent formatting
• Choose readable fonts (Arial, Calibri)
• Include white space for readability
• Save as PDF
• Proofread carefully for errors`}
  />

        <Section
          title="7. Additional Sections"
          content={`• Projects: Highlight relevant projects with descriptions
• Certifications: List relevant certifications
• Volunteer Work: Include if relevant to the job
• Languages: Mention languages spoken and proficiency levels
• Publications: Include if relevant to your field`}
        />

        <Section
          title="8. Final Tips"
          content={`• Tailor your resume for each job application
• Use keywords from the job description
• Focus on achievements, not just duties
• Keep it professional and concise
• Avoid personal pronouns (I, me, my)
• Use bullet points for clarity
• Include a cover letter when possible
• Get feedback from peers or mentors
• Use online tools to check formatting and grammar
• Keep your LinkedIn profile updated and consistent with your resume`}
        />
      </div>
    </div>
  );
}
function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-700">{content}</p>
    </div>
  );
}