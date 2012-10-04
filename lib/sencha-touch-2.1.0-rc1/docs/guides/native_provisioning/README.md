# Creating an Apple iOS Development certificate in P12 format

Sencha SDK tools require a P12 certificate to package iOS applications. Obtaining a P12 certificate is a 2 step process.
First: setup a development certificate on Apple iOS provisioning portal, and second: convert the development certificate
to a P12 certificate.

## On Mac OS

### Creating a developer certificate on iOS Provisioning Portal

If you have not created a development certificate on the Apple iOS Provisioning
Portal, follow the steps outlined below to create the certificate:

1. Navigate to the Certificates section of the portal
2. Follow the steps on the portal to create a development certificate:

   How to create a development certificate:

   1. Generate a Certificate Signing Request (CSR) with a public key

      - In your Applications folder, open the Utilities folder and launch Keychain Access.
      - Choose Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority.
      - In the Certificate Information window, enter or select the following information:
        - In the User Email Address field, enter your email address
        - In the Common Name field, enter your name
        - In the Request is group, select the Saved to disk option
      - Click Continue.
      - The Certificate Assistant saves a Certificate Signing Request (CSR) file to your Desktop.
      - The public/private key pair will be generated when you create the Certificate Signing Request (CSR) if you use the Key Chain Assistant to create the CSR.

    2. Submit the CSR through the Provisioning Portal.

       - Click the Development tab
       - Upload the certificate by choosing the file
       - Click Submit

3. After the certificate is generated, download the certificate and import it into Keychain:

   * Open Keychain Access application (in the Applications/Utilities folder)
   * Select File > Import and navigate to the certificate (.cer file) you just downloaded from the Apple iOS Provisioning Portal

### Exporting developer certificate into P12 format from Keychain

Once the developer certificate is imported into Keychain, you can export it to the P12 format:

1. Open Keychain Access application (in the Applications/Utilities folder)
2. Select the Keys Category
3. Select the private key associated with your Apple iOS development certificate. The private key has the following name pattern: iPhone Developer: `<First Name>` `<Last Name>` public key reference
4. Select File > Export Items... and save the key in the P12 format
5. This file is what you specific in the Sencha SDK packager config file for the "certificatePath" variable.

## On Windows

Pre-requisites:

  * Install Open SSL (http://www.openssl.org/related/binaries.html)
  * Open SSL requires Visual C++ 2008 Redistributables (VCRedist). Please follow the instructions on the above web page to download and install VCRedist if you do not have that on your system.

### Creating a developer certificate on iOS Provisioning Portal

If you have not created a development certificate on the Apple iOS Provisioning Portal, follow the steps outlined below
to create the certificate:

1. Open a command prompt window
2. Change directory to the OpenSSL bin directory
3. Create a private key using openssl genrsa command:

		openssl genrsa –out myprivatekey.key 2048

	Note: Please keep this myprivatekey.key file. You will need this to generate the P12 certificate.

4. Create a cerfiticate signing request (csr) using the following command:

		openssl req –new –key myprivatekey.key –out CertificateSigningRequest.certSigningRequest –sub "/
		emailAddress=yourAddress@example.com, CN=John Doe, C=US"

	Replace email address, CN (certificate name) and C (country) with your own values.

5. Upload this CSR to the Apple iOS Provisioning Portal, in the Certificates section. You will need to associate this
certificate with the appropriate application provisioning profile.

### Exporting developer certificate into P12 format from Keychain

Pre-requisite:

* iOS development certificate from the Apple iOS Provisioning Portal
* Private key file (e.g. myprivatekey.key) used to generate the development certificate

Using the following steps to create the p12 file that combines the development
certificate with your private key:

1. Download and save the development certificate (ios_development.cer) from the Apple iOS Provisioning Portal.
2. Convert the development certificate into a PEM file using the following command:

		openssl x509 –in ios_development.cer –inform DER –out ios_development.pem –outform PEM

3. Generate the P12 file:

		openssl pkcs12 –export –inkey myprivatekey.key –in ios_development.pem –out ios_development.p12

4. This file is what you specific in the Sencha SDK packager config file for the "certificatePath" variable.

If you have generated the development certificate (ios_development.cer) from a Mac before, you will need to use the
private key from the Mac Keychain instead of the key (e.g. myprivatekey.key) generated using openssl. You can replace
step 3 above with the following steps:

1. Export the private key as a P12 file (e.g. myprivatekey.p12) from the Keychain Access application from the Mac.
2. Convert this key into a PEM key:

		openssl pkcs12 –nocerts –in myprivatekey.p12 –out myprivatekey.pem

3. Generate the p12 file:

		openssl pkcs12 –export –inkey myprivatekey.pem –in ios_development.pem –out ios_development.p12

