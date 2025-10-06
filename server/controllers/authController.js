const supabase = require('../config/supabaseClient');

// Sign up a new user
const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // The user is signed up, but email confirmation might be required.
    // The `data` object contains user and session info if confirmation is not required.
    return res.status(201).json({ message: 'User created successfully. Please check your email for confirmation.', data });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Sign in an existing user
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Set the access token in an HTTPOnly cookie for security
    res.cookie('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: data.session.expires_in * 1000, // a week
      sameSite: 'lax'
    });

    return res.status(200).json({ message: 'Signed in successfully.', user: data.user });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Sign out the current user
const signout = async (req, res) => {
  // Supabase signout is typically handled client-side, but we can clear the cookie.
  res.clearCookie('sb-access-token');
  return res.status(200).json({ message: 'Signed out successfully.' });
};

// Verify user session from cookie
const verify = async (req, res) => {
  // The authMiddleware will have already verified the token and attached the user.
  // If we reach this point, the user is authenticated.
  res.status(200).json({ success: true, user: req.user });
};

module.exports = { signup, signin, signout, verify };
