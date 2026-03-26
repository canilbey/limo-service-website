import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import GradientButton from '../components/common/GradientButton';
import ExtrasSelector from '../components/booking/ExtrasSelector';
import StepIndicator from '../components/common/StepIndicator';
import VehicleCard from '../components/booking/VehicleCard';
import type { Vehicle } from '../types/booking';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockVehicle: Vehicle = {
  id: 'aviator',
  name: 'Business Class',
  description: 'Executive sedan for business travel',
  maxPassengers: 3,
  maxLuggage: 2,
  price: 85,
  image: '',
};

describe('GradientButton', () => {
  it('renders with correct label', () => {
    renderWithTheme(<GradientButton>Book Now</GradientButton>);
    expect(screen.getByText('Book Now')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    renderWithTheme(<GradientButton onClick={handleClick}>Click Me</GradientButton>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is passed', () => {
    renderWithTheme(<GradientButton disabled>Disabled</GradientButton>);
    expect(screen.getByText('Disabled').closest('button')).toBeDisabled();
  });

  it('renders as full width when fullWidth is set', () => {
    renderWithTheme(<GradientButton fullWidth>Full Width</GradientButton>);
    const button = screen.getByText('Full Width').closest('button');
    expect(button).toHaveStyle({ width: '100%' });
  });
});

describe('ExtrasSelector', () => {
  const defaultExtras = {
    infantSeat: 0,
    childSeat: 0,
    boosterSeat: 0,
    extraWaiting: 0,
  };

  it('renders all extra options', () => {
    renderWithTheme(<ExtrasSelector value={defaultExtras} onChange={vi.fn()} />);
    expect(screen.getByText('Infant Seat')).toBeInTheDocument();
    expect(screen.getByText('Child Seat')).toBeInTheDocument();
    expect(screen.getByText('Booster Seat')).toBeInTheDocument();
    expect(screen.getByText('Extra Waiting Time')).toBeInTheDocument();
  });

  it('shows current count values', () => {
    const extras = { ...defaultExtras, childSeat: 2 };
    renderWithTheme(<ExtrasSelector value={extras} onChange={vi.fn()} />);
    const counts = screen.getAllByText('2');
    expect(counts.length).toBeGreaterThan(0);
  });

  it('calls onChange when increment is clicked', () => {
    const handleChange = vi.fn();
    renderWithTheme(<ExtrasSelector value={defaultExtras} onChange={handleChange} />);
    const addButtons = screen.getAllByTestId !== undefined
      ? screen.getAllByRole('button').filter((btn) => btn.querySelector('svg'))
      : screen.getAllByRole('button');
    
    const firstAddButton = addButtons[1];
    fireEvent.click(firstAddButton);
    expect(handleChange).toHaveBeenCalled();
  });
});

describe('StepIndicator', () => {
  it('renders 4 steps', () => {
    renderWithTheme(<StepIndicator currentStep={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows step labels', () => {
    renderWithTheme(<StepIndicator currentStep={1} />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Select Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Trip Details')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('renders without crashing for any step value', () => {
    [1, 2, 3, 4].forEach((step) => {
      const { unmount } = renderWithTheme(<StepIndicator currentStep={step} />);
      unmount();
    });
  });
});

describe('VehicleCard', () => {
  it('renders vehicle name and service highlights', () => {
    renderWithTheme(
      <VehicleCard vehicle={mockVehicle} isSelected={false} onSelect={vi.fn()} />
    );
    expect(screen.getByText('Business Class')).toBeInTheDocument();
    expect(screen.getByText('Includes Meet & Greet')).toBeInTheDocument();
  });

  it('renders vehicle capacity info', () => {
    renderWithTheme(
      <VehicleCard vehicle={mockVehicle} isSelected={false} onSelect={vi.fn()} />
    );
    expect(screen.getByText('Max 3 passengers')).toBeInTheDocument();
    expect(screen.getByText('2 bags')).toBeInTheDocument();
  });

  it('shows "Selected" text when isSelected is true', () => {
    renderWithTheme(
      <VehicleCard vehicle={mockVehicle} isSelected={true} onSelect={vi.fn()} />
    );
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('shows "Select" button when not selected', () => {
    renderWithTheme(
      <VehicleCard vehicle={mockVehicle} isSelected={false} onSelect={vi.fn()} />
    );
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('calls onSelect when SELECT button is clicked', () => {
    const handleSelect = vi.fn();
    renderWithTheme(
      <VehicleCard vehicle={mockVehicle} isSelected={false} onSelect={handleSelect} />
    );
    fireEvent.click(screen.getByText('Select'));
    expect(handleSelect).toHaveBeenCalledWith(mockVehicle);
  });

  it('renders van vehicle correctly', () => {
    const vanVehicle: Vehicle = {
      ...mockVehicle,
      id: 'yukon',
      name: 'GMC Yukon XL',
      maxPassengers: 6,
      maxLuggage: 6,
      price: 120,
    };
    renderWithTheme(
      <VehicleCard vehicle={vanVehicle} isSelected={false} onSelect={vi.fn()} />
    );
    expect(screen.getByText('GMC Yukon XL')).toBeInTheDocument();
    expect(screen.getByText('Max 6 passengers')).toBeInTheDocument();
    expect(screen.getByText('Door to Door Transfer')).toBeInTheDocument();
  });
});
