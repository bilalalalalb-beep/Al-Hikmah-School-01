import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  registration_id: string;
  father_name: string;
  father_phone: string;
  blood_group: string;
  father_cnic_or_id: string;
  current_class_id: string;
  photo_url?: string;
  is_orphan?: boolean;
}

interface IdCardTemplateProps {
  student: Student;
  schoolName: string;
  schoolAddress: string;
  classNameStr: string;
  showContact: boolean;
  showBloodGroup: boolean;
  showFatherCnic: boolean;
}

export const IdCardTemplate: React.FC<IdCardTemplateProps> = ({
  student,
  schoolName,
  schoolAddress,
  classNameStr,
  showContact,
  showBloodGroup,
  showFatherCnic
}) => {
  const fullName = `${student.first_name} ${student.last_name || ''}`.trim();
  const PRIMARY_COLOR = '#171f27'; // Dark theme color from the example

  return (
    <div
      dir="rtl"
      style={{
        width: '54mm',
        height: '86mm',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Noto Nastaliq Urdu', 'Inter', sans-serif",
        boxSizing: 'border-box',
        border: '1px solid #e2e8f0', // Slight border just in case
      }}
    >
      {/* Top Section */}
      <div style={{ textAlign: 'center', paddingTop: '12px' }}>
        <div style={{
          width: '45px',
          height: '45px',
          margin: '0 auto',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '5px'
        }}>
          {/* Default Logo Placeholder */}
          <span style={{ fontSize: '24px' }}>🏫</span>
        </div>
        
        <h2 style={{
          fontSize: '11px',
          fontWeight: 'bold',
          color: PRIMARY_COLOR,
          margin: 0,
          padding: '0 5px',
          lineHeight: '1.4'
        }}>
          {schoolName}
        </h2>
        <p style={{
          fontSize: '7px',
          fontWeight: '500',
          color: '#64748b',
          margin: '2px 0 0 0',
          fontFamily: "'Inter', sans-serif"
        }}>
          {schoolAddress}
        </p>
      </div>

      {/* Bottom Section (Triangle + Rectangle) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '52%',
        backgroundColor: PRIMARY_COLOR,
        clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '35px',
        color: '#ffffff'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 'bold',
          margin: 0,
          lineHeight: 1.2
        }}>{fullName}</h3>
        <p style={{
          fontSize: '9px',
          fontWeight: '500',
          margin: '2px 0 8px 0',
          color: '#cbd5e1'
        }}>{classNameStr}</p>

        {/* Info Grid */}
        <div style={{
          width: '85%',
          fontSize: '7px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '3px 8px',
          textAlign: 'right'
        }}>
          <div style={{ fontWeight: 'bold', color: '#94a3b8' }}>آئی ڈی:</div>
          <div>{student.registration_id}</div>
          
          <div style={{ fontWeight: 'bold', color: '#94a3b8' }}>والد:</div>
          <div>{student.father_name}</div>
          
          {showContact && (
            <>
              <div style={{ fontWeight: 'bold', color: '#94a3b8' }}>رابطہ:</div>
              <div style={{ fontFamily: "'Inter', sans-serif" }}>{student.father_phone || '---'}</div>
            </>
          )}
          {showBloodGroup && (
            <>
              <div style={{ fontWeight: 'bold', color: '#94a3b8' }}>خون:</div>
              <div>{student.blood_group || '---'}</div>
            </>
          )}
          {showFatherCnic && (
            <>
              <div style={{ fontWeight: 'bold', color: '#94a3b8' }}>CNIC:</div>
              <div style={{ fontFamily: "'Inter', sans-serif" }}>{student.father_cnic_or_id || '---'}</div>
            </>
          )}
        </div>

        {/* QR Code */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          backgroundColor: '#fff',
          padding: '2px',
          borderRadius: '4px'
        }}>
          <QRCodeSVG value={student.registration_id} size={30} />
        </div>
      </div>

      {/* Profile Picture */}
      <div style={{
        position: 'absolute',
        top: '34%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        padding: '3px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}>
        {student.photo_url ? (
          <img 
            src={student.photo_url} 
            alt={fullName} 
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover'
            }} 
            crossOrigin="anonymous"
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            fontSize: '20px'
          }}>
            👤
          </div>
        )}
      </div>
    </div>
  );
};
