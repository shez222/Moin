'use client'

import { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
// import { Button } from '@/components/ui/button'
import { AuthContext } from '@/../context/AuthContext'

export default function IdCard() {
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSide, setActiveSide] = useState('front')
  const [qrCode, setQrCode] = useState('')
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        // Replace with your API endpoint
        const response = await fetch('/api/doctor/profile/getdocprofile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`, // Fixed syntax
          },
        })
        if (!response.ok) throw new Error('Failed to fetch member data')
        const data = await response.json()
        console.log(data.formDataId._id);

        setMemberData(data.formDataId)
        
        // Prepare the QR Code data
        const qrData = JSON.stringify({
          id: data._id, // ID
          name: data.formDataId.name, // Name
          cnic: data.formDataId.cnic, // CNIC
          phone: data.formDataId.phone,
          institution: data.formDataId.applicantAffiliation.institution
        })

        const qrCodeUrl = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        })
        
        setQrCode(qrCodeUrl)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMemberData()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  }

  const downloadCard = async () => {
    const element = document.getElementById('card')
    if (element) {
      const canvas = await html2canvas(element)
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `card-${activeSide}.png`
      link.href = dataUrl
      link.click()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="p-6 text-center">
          <p className="text-red-500">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Card Container */}
        <div 
          id="card"
          className="relative w-full aspect-[1/1.57] bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
        >
          {/* Card Content */}
          <div className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            activeSide === 'back' ? 'translate-x-[-100%]' : 'translate-x-0'
          }`}>
            {/* Front Side */}
            <div className="absolute inset-0 bg-slate-50">
              {/* Corners */}
              <div className="absolute top-0 left-0 w-28 h-32 bg-blue-900 rounded-br-[100%]" />
              <svg className="absolute top-[100px] left-0" width="70" height="70" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,40 40,0 0 0,0" fill="#1E3A8A" />
              </svg>

              <div className="absolute bottom-0 right-0 w-28 h-32 bg-blue-900 rounded-tl-[100%]" />
              <svg className="absolute bottom-[100px] right-0" width="70" height="70" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,40 40,40 40 0,0" fill="#1E3A8A" />
              </svg>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col p-5">
                  {/* Logo */}
                  <div className="absolute top-5 right-5">
                  <Image
                    src="/logo.png"
                    alt="PSN Logo"
                    width={200}
                    height={200}
                    className="rounded-full h-20 w-40 object-cover "
                  />
                </div>

                <div className="relative mt-28 flex-1">     
                  {/* Photo */}
                  <div className="relative z-10 w-56 h-56 mx-auto mt-6">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={memberData?.profilePic || "/placeholder.svg?height=112&width=112"}
                        alt="Member Photo"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="relative mb-36 text-center">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    Dr. {memberData?.name || 'Naila Shahbaz'}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {memberData?.applicantAffiliation?.designation || 'President'}
                  </p>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <p>Membership No: {memberData?.membershipNumber || '0001'}</p>
                    <p>Member Since: {formatDate(memberData?.createdAt) || '01/01/2010'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 translate-x-full justify-items-center mt-32">
              {/* Content */}
              <div className="relative z-10 h-full p-6">
                {/* Details */}
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Institute: {memberData?.applicantAffiliation?.institution || 'Institute Civil Hospital'}</p>
                  <p>Address: {memberData?.address || 'Mission Road, Karachi'}</p>
                  <p>Phone: {memberData?.phone || '0333-0000000'}</p>
                  <p>CNIC No: {memberData?.cnic || '4210-0000000-0'}</p>
                </div>

                {/* QR Code */}
                <div className="mt-6 flex justify-center">
                  {qrCode && (
                    <Image
                      src={qrCode}
                      alt="QR Code"
                      width={150}
                      height={150}
                      className="rounded"
                    />
                  )}
                </div>

                {/* Return Text */}
                <div className="relative z-10 mt-6 text-center text-sm text-gray-600">
                  <p className='font-bold mb-4'>If this card is found please return to:</p>
                  <div className="mt-2">
                    <div className="w-48 mx-auto border-b border-gray-300"></div>
                  </div>
                  <div className="mt-2">
                    <div className="w-48 mx-auto border-b border-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setActiveSide(side => side === 'front' ? 'back' : 'front')}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 rounded-3xl h-12"
          >
            Flip Card
          </button>
          <button 
            onClick={downloadCard}
            className="flex-1 bg-orange-400 hover:bg-orange-500 rounded-3xl h-12"
          >
            Download {activeSide === 'front' ? 'Front' : 'Back'}
          </button>
        </div>
      </div>
    </div>
  )
}
