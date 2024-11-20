module nexuschat::user {
    use sui::object::{UID, ID};
    use sui::storage::{Table, TableRef};
    use sui::tx_context::TxContext;

    /// Define the User structure
    struct User has key {
        id: UID,
        wallet_address: vector<u8>,
        username: vector<u8>,
        password: vector<u8>,
        created_at: u64,
        is_deleted: bool,
    }

    /// Mapping of wallet addresses to User IDs for efficient lookups
    struct UserRegistry has key {
        table: Table<vector<u8>, ID>, // Maps wallet addresses to User object IDs
    }

    /// Initialize the UserRegistry
    public fun init_registry(ctx: &mut TxContext): UserRegistry {
        UserRegistry {
            table: Table::new(ctx),
        }
    }

    /// Create a new user or reuse a deleted one
    public fun create_user(
        registry: &mut UserRegistry,
        id: UID,
        wallet_address: vector<u8>,
        username: vector<u8>,
        password: vector<u8>,
        created_at: u64,
        ctx: &mut TxContext
    ): User {
        // Check if there is a deleted user to reuse
        let user_id_opt = Table::borrow(&registry.table, &wallet_address);
        if let Some(user_id) = user_id_opt {
            if exists<User>(*user_id) {
                let mut user = borrow_global_mut<User>(*user_id);
                if (user.is_deleted) {
                    // Reuse the deleted user
					user.id = id;
                    user.username = username;
                    user.password = password;
                    user.created_at = created_at;
                    user.is_deleted = false;
                    return user;
                }
            }
        }

        // Create a new user if no deleted user is found
        let user = User {
            id: UID::new(ctx),
            wallet_address: wallet_address.clone(),
            username,
            password,
            created_at,
            is_deleted: false,
        };

        let user_id = ID::from(&user.id);
        Table::add(&mut registry.table, wallet_address, user_id);
        user
    }

    /// Delete a user (mark as deleted)
    public fun delete_user(registry: &mut UserRegistry, wallet_address: vector<u8>) {
        let user_id_opt = Table::borrow(&registry.table, &wallet_address);
        assert!(user_id_opt.is_some(), "User not found");

        let user_id = *user_id_opt.borrow();
        assert!(exists<User>(user_id), "User does not exist");

        let mut user = borrow_global_mut<User>(user_id);
        user.is_deleted = true;
    }

    /// Fetch a user by their wallet address
    public fun get_user_by_wallet(
        registry: &UserRegistry,
        wallet_address: vector<u8>
    ): Option<User> {
        let user_id_opt = Table::borrow(&registry.table, &wallet_address);
        match user_id_opt {
            Some(user_id) => {
                if exists<User>(*user_id) {
                    let user = borrow_global<User>(*user_id);
                    Some(user)
                } else {
                    None
                }
            },
            None => None,
        }
    }

    /// Fetch a user by their ID
    public fun fetch_user_by_id(user_id: ID): Option<User> {
        if (exists<User>(user_id)) {
            Some(borrow_global<User>(user_id))
        } else {
            None
        }
    }

    /// Update a user's password
    public fun update_user_password(
        registry: &mut UserRegistry,
        wallet_address: vector<u8>,
        new_password: vector<u8>
    ) {
        let user_id_opt = Table::borrow(&registry.table, &wallet_address);
        assert!(user_id_opt.is_some(), "User not found");

        let user_id = *user_id_opt.borrow();
        assert!(exists<User>(user_id), "User does not exist");

        let mut user = borrow_global_mut<User>(user_id);
        user.password = new_password;
    }

    /// List all users (optional utility function, returns only active users)
    public fun list_active_users(registry: &UserRegistry): vector<User> {
        let mut active_users = vector::empty<User>();
        let keys = Table::keys(&registry.table);

        vector::iter(keys, |wallet_address| {
            let user_id_opt = Table::borrow(&registry.table, wallet_address);
            if let Some(user_id) = user_id_opt {
                if exists<User>(*user_id) {
                    let user = borrow_global<User>(*user_id);
                    if (!user.is_deleted) {
                        vector::push_back(&mut active_users, user);
                    }
                }
            }
        });

        active_users
    }
}
