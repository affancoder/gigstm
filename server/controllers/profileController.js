const supabase = require('../config/supabaseClient');

const saveProfileData = async (req, res) => {
  const userId = req.user.id; // Assuming authMiddleware populates req.user.id

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID not found.' });
  }

  const {
    name, email, mobile, jobRole, gender, dob, aadhaar, pan,
    address1, address2, city, state, country, pincode, about,
    experienceYears, experienceMonths, employmentType, occupation,
    jobRequirement, heardAbout, interestType, profileImage,
    bankName, accountNumber, ifscCode,
    aadhaarFront, aadhaarBack, panCardUpload, passbookUpload
  } = req.body;

  try {
    // 1. Upsert public.profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: name,
        username: email, // Using email as username for simplicity, adjust if needed
        email: email,
        mobile: mobile,
        job_role: jobRole,
        gender: gender,
        dob: dob,
        aadhaar: aadhaar,
        pan: pan,
        address_line1: address1,
        address_line2: address2,
        city: city,
        state: state,
        country: country,
        pincode: pincode,
        about: about,
        experience_years: experienceYears,
        experience_months: experienceMonths,
        employment_type: employmentType,
        occupation: occupation,
        job_requirement: jobRequirement,
        heard_about: heardAbout,
        interest_type: interestType,
        profile_image_url: profileImage, // This will be the URL from storage
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select();

    if (profileError) {
      console.error('Supabase Profile Upsert Error:', profileError);
      return res.status(500).json({ error: profileError.message });
    }

    // 2. Upsert public.bank_details
    if (bankName || accountNumber || ifscCode) {
      const { data: bankData, error: bankError } = await supabase
        .from('bank_details')
        .upsert({
          id: userId,
          bank_name: bankName,
          account_number: accountNumber,
          ifsc_code: ifscCode,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select();

      if (bankError) {
        console.error('Supabase Bank Details Upsert Error:', bankError);
        return res.status(500).json({ error: bankError.message });
      }
    }

    // 3. Upsert public.kyc_documents
    if (aadhaarFront || aadhaarBack || panCardUpload || passbookUpload) {
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_documents')
        .upsert({
          id: userId,
          aadhaar_front_url: aadhaarFront,
          aadhaar_back_url: aadhaarBack,
          pan_card_url: panCardUpload,
          passbook_url: passbookUpload,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select();

      if (kycError) {
        console.error('Supabase KYC Documents Upsert Error:', kycError);
        return res.status(500).json({ error: kycError.message });
      }
    }

    return res.status(200).json({ message: 'Profile data saved successfully!', profile: profileData[0] });

  } catch (error) {
    console.error('Server Error saving profile data:', error);
    return res.status(500).json({ error: 'Internal server error while saving profile data.' });
  }
};

module.exports = { saveProfileData };