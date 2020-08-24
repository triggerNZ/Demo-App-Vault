import React from 'react'; // we need this to make JSX compile

export type LoginProps = {
    secret: string, 
    passphrase: string, 
    lastLoginFailed: boolean,
    onUpdate: (secret: string, passphrase: string) => void, 
    onLoginClicked: () => void
}

export const Login = (p: LoginProps) => <div>
    <h2>Log In</h2>
    <label htmlFor="secret">Secret</label>
    <input name="secret" id="secret" type="text" placeholder="Secret" value={p.secret} onChange={(e) => p.onUpdate(e.target.value, p.passphrase)}/>
    <label htmlFor="passphrase">Passphrase</label>
    <input name="passphrase" id="passphrase" type="password" placeholder="passphrase" value={p.passphrase} onChange={(e) => p.onUpdate(p.secret, e.target.value)} />
    {p.lastLoginFailed ? <p>Incorrect Login. Plase try again</p> : <span/>}
    <button className="primary large" onClick={(e) => p.onLoginClicked()}>Log In</button>
</div>