import { getAuth, sendEmailVerification, updateEmail } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';


const profile = () => {

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [editableEmail, setEditableEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false); // To track email verification status
  const [isVerificationSent, setIsVerificationSent] = useState<boolean>(false); // To track if the verification email was sent
  const auth = getAuth();

  useEffect(() => {
    const users = auth.currentUser;
    if (users) {
      setUserEmail(users.email);  // Get the email from the user object
      setEditableEmail(users.email || '');  // Set the editable email to the user's email
      setIsEmailVerified(users.emailVerified);
    } else {
      console.log('No user is logged in.');
    }
    setLoading(false);
  }, []);

  // const getUserData = async () => {

  //   const q = query(userRef, where('userId', '!=', user?.uid));
  //   const querySnapshot = await getDocs(q);
  //   console.log(querySnapshot)
  // };

  // const handleEmailUpdate = async () => {
  //   if (!editableEmail || editableEmail === userEmail) {
  //     setError('Please enter a new email address.');
  //     return;
  //   }

  //   const user = auth.currentUser;
  //   if (user) {
  //     setLoading(true);
  //     try {
  //       await updateEmail(user, editableEmail); // Update email in Firebase
  //       setUserEmail(editableEmail); // Update local state
  //       setError('');
  //       setLoading(false);
  //     } catch (e) {
  //       setError('Failed to update email. Please try again.');
  //       setLoading(false);
  //     }
  //   }
  // };

   const handleEmailUpdate = async () => {
    const user = auth.currentUser;

    if (!user) {
      setError('No user is signed in. Please log in first.');
      return;
    }

    if (!isEmailVerified) {
      setError('Please verify your email before updating.');
      return;
    }

    if (!editableEmail || editableEmail === userEmail) {
      setError('Please enter a new email address.');
      return;
    }

    setLoading(true);

    try {
      await updateEmail(user, editableEmail); // Update email in Firebase
      setUserEmail(editableEmail); // Update local state
      setError('');
      setLoading(false);
    } catch (e: any) {
      setError(`Failed to update email: ${e.message}`);
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    const users = auth.currentUser;

    if (!users) {
      setError('No user is signed in. Please log in first.');
      return;
    }

    if (users.emailVerified) {
      setError('Your email is already verified!');
      return;
    }

    setLoading(true);

    try {
      await sendEmailVerification(users); // Send the verification email
      setIsVerificationSent(true); // Track the sent verification email
      setError('Verification email sent. Please check your inbox.');
      setLoading(false);
    } catch (e: any) {
      const errorCode = e.code;
      if (errorCode === 'auth/too-many-requests') {
        setError('You have sent too many requests. Please try again later.');
      } else {
        setError(`Failed to send verification email: ${e.message}`);
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.profileCard}>
      <Image source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }} style={styles.avatar} />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
         <>
          <Text style={styles.name}>Email: {userEmail}</Text>

          {isEmailVerified ? (
            <Text>Your email is verified!</Text>
          ) : (
            <View style={styles.verificationContainer}>
              <Text style={styles.error}>Your email is not verified.</Text>
              <Button title="Send Verification Email" onPress={handleSendVerification} />
              {isVerificationSent && <Text>An email has been sent to verify your email.</Text>}
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Edit your email"
            value={editableEmail}
            onChangeText={setEditableEmail}
          />
          
          <Button title="Update Email" onPress={handleEmailUpdate} />
          
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
      )}
    </View>
      );
}

export default profile;


const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 5,
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 80
  },
  name: { fontSize: 18, fontWeight: '600' },
  status: { color: '#666' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  verificationContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});