import React from 'react'
import { render, waitForDomChange, fireEvent } from '@testing-library/react'
import App from './App'

test('renders learn react link', () => {
  const { getByText } = render(<App />)
  getByText(/Write and Check/i).click()
})
