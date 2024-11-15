module nexuschat::user {
	use sui::object::UID;
	

	struct User has key {
		id: UID,
		wallet_address: vector<u8>,
		username: vector<u8>,
		password: vector<u8>,
		created_at: u64,
	}

	public fun create_user(wallet_address: vector<u8>, username: vector<u8>, password: vector<u8>, created_at: u64): User {
		User {
			id: UID::new(),
			wallet_address,
			username,
			password,
			created_at,
		}
	}	
}
