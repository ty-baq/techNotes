import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className='public'>
            <header>
                <h1>
                    Welcome to <span className="nowrap"> Sunday Repairs!</span>
                </h1>
            </header>
            <main className='public__main'>
                <p>
                    Located in Beautiful Downtown Festac, Sunday Repairs provide
                    a trained staff ready to meet your tech repair needs.
                </p>
                <address className='public__addr'>
                    Sunday Repairs<br />
                    23 Road, V Close<br />
                    Festac Town, Lagos<br />
                    <a href='tel:08023456789'>080-2345-6789</a>
                </address>
                <br />
                <p>Owner: Sunday Adeoba</p>
            </main>
            <footer>
                <Link to='/Login'>Employee Login</Link>
            </footer>
        </section>
    )
    return content

}

export default Public
