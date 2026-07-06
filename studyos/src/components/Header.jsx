export default function Header({ user }) {
  return (
    <header>
      <input placeholder="Search everything..." />

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {user && (
          <>
            <img
              src={user.picture}
              alt="profile"
              style={{ width: 32, height: 32, borderRadius: "50%" }}
            />
            <span>{user.name}</span>
          </>
        )}
      </div>
    </header>
  );
}