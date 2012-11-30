CREATE UNIQUE INDEX oauth_user_idx ON kort.user (oauth_provider, oauth_user_id);
CREATE UNIQUE INDEX secret_idx ON kort.user (secret);