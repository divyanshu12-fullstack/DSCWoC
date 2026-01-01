import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Starfield from '../components/Starfield'

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set())
  const navigate = useNavigate()

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is DSC Winter of Code?",
          answer: "DSC Winter of Code is a student-focused open source program designed to help beginners get started with open source contributions. It provides a platform for students to contribute to real projects and learn from experienced mentors."
        },
        {
          question: "How do I participate in DSC WoC?",
          answer: "Simply sign up using your GitHub account, browse available projects, and start contributing! You can submit pull requests to any approved project and earn points and badges for your contributions."
        },
        {
          question: "Do I need prior experience with open source?",
          answer: "Not at all! DSC WoC is designed for beginners. We have projects of all difficulty levels, from beginner-friendly to advanced. Start with easier projects and gradually work your way up."
        },
        {
          question: "Is there any registration fee?",
          answer: "No, DSC Winter of Code is completely free to participate in. All you need is a GitHub account and enthusiasm to learn and contribute."
        }
      ]
    },
    {
      category: "Contributing",
      questions: [
        {
          question: "How do I submit a pull request?",
          answer: "You can submit pull requests directly on GitHub to any approved project. Our system automatically tracks your contributions and awards points. You can also manually submit PRs through our platform for validation."
        },
        {
          question: "How are points calculated?",
          answer: "Points are awarded based on various factors: 10 points for merged PRs, 5 points for open PRs, 2 points for closed PRs. Additional points are awarded for code complexity, number of files changed, and mentor validation."
        },
        {
          question: "What types of contributions are accepted?",
          answer: "We accept all types of contributions including code, documentation, bug fixes, feature additions, UI/UX improvements, and more. Every contribution matters!"
        },
        {
          question: "Can I contribute to multiple projects?",
          answer: "Yes! You're encouraged to contribute to multiple projects. This helps you learn different technologies and increases your chances of earning more points and badges."
        }
      ]
    },
    {
      category: "Badges & Rewards",
      questions: [
        {
          question: "How do I earn badges?",
          answer: "Badges are automatically awarded based on your contributions. For example, you get the 'First Steps' badge for your first PR, 'Contributor' badge for your first merged PR, and many more based on your activity."
        },
        {
          question: "What are the different badge types?",
          answer: "Badges are categorized by rarity: Common (basic achievements), Rare (significant milestones), Epic (impressive contributions), and Legendary (exceptional achievements). Each badge also awards bonus points."
        },
        {
          question: "How does the leaderboard work?",
          answer: "The leaderboard ranks participants based on their total points. Rankings are updated automatically as you earn more points through contributions and badge rewards."
        },
        {
          question: "Are there any prizes?",
          answer: "Yes! Top contributors receive recognition, certificates, and special prizes. Details about specific rewards are announced during the event period."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "I'm having trouble with GitHub authentication",
          answer: "Make sure you're using a valid GitHub account and have granted the necessary permissions. If you continue to face issues, try logging out and logging back in, or contact our support team."
        },
        {
          question: "My pull request isn't showing up",
          answer: "Our system syncs pull requests every 30 minutes. If your PR still doesn't appear after an hour, you can manually submit it through the dashboard or contact support."
        },
        {
          question: "How do I become a mentor?",
          answer: "Mentors are experienced contributors who help guide newcomers. If you're interested in becoming a mentor, reach out to the DSC team with your GitHub profile and experience details."
        },
        {
          question: "Can I add my own project?",
          answer: "Project additions are handled by mentors and admins. If you have a project you'd like to include, contact the DSC team with your project details and we'll review it for inclusion."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
      <Starfield />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-white">Frequently Asked Questions</h1>
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Intro */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything you need to know about DSC WoC
            </h2>
            <p className="text-gray-300 text-lg">
              Can't find what you're looking for? <button 
                onClick={() => navigate('/contact')}
                className="text-stellar-cyan hover:text-nebula-blue transition-colors duration-200"
              >
                Contact us
              </button> and we'll help you out.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="w-2 h-2 bg-stellar-cyan rounded-full mr-3"></span>
                  {category.category}
                </h3>
                
                <div className="space-y-4">
                  {category.questions.map((item, questionIndex) => {
                    const itemIndex = `${categoryIndex}-${questionIndex}`
                    const isOpen = openItems.has(itemIndex)
                    
                    return (
                      <div key={questionIndex} className="border border-white/10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleItem(itemIndex)}
                          className="w-full text-left p-4 bg-white/5 hover:bg-white/10 transition-colors duration-200 flex justify-between items-center"
                        >
                          <span className="text-white font-medium pr-4">{item.question}</span>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {isOpen && (
                          <div className="p-4 bg-white/2 border-t border-white/10">
                            <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions? */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-stellar-cyan/20 to-nebula-blue/20 border border-stellar-cyan/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-300 mb-6">
                Our team is here to help you succeed in your open source journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-stellar-cyan hover:bg-stellar-cyan/80 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg border border-white/20 transition-colors duration-200"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default FAQ