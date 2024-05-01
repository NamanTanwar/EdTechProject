import { render, screen } from '@testing-library/react';
import Home from '../Home';

describe('Home',()=>{
    test('renders Home Component',()=>{
        render(<Home />)
        const heading=screen.getByText(/Empower Your Future with coding Skills/i)
        expect(heading).toBeInTheDocument()
    })
})