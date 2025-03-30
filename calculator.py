import tkinter as tk
from tkinter import ttk
import math
import numpy as np
from scipy import special
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

class AdvancedCalculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Advanced Scientific Calculator")
        self.root.geometry("800x600")
        self.root.configure(bg='#2C3E50')
        
        # Style configuration
        style = ttk.Style()
        style.configure('TButton', padding=5, font=('Helvetica', 10))
        
        # Display
        self.display = tk.Entry(root, width=40, font=('Helvetica', 20), justify='right', bg='#ECF0F1')
        self.display.grid(row=0, column=0, columnspan=5, padx=5, pady=5, sticky='nsew')
        
        # Scientific functions frame
        self.create_scientific_functions()
        
        # Basic operations frame
        self.create_basic_operations()
        
        # Memory operations
        self.memory = 0
        
        # Configure grid weights
        for i in range(8):
            root.grid_rowconfigure(i, weight=1)
        for i in range(5):
            root.grid_columnconfigure(i, weight=1)
            
    def create_scientific_functions(self):
        # Scientific functions
        scientific_buttons = [
            ('sin', 1, 0), ('cos', 1, 1), ('tan', 1, 2),
            ('√', 1, 3), ('x²', 1, 4),
            ('log', 2, 0), ('ln', 2, 1), ('π', 2, 2),
            ('e', 2, 3), ('!', 2, 4),
            ('∫', 3, 0), ('∑', 3, 1), ('lim', 3, 2),
            ('Γ', 3, 3), ('β', 3, 4)
        ]
        
        for (text, row, col) in scientific_buttons:
            btn = ttk.Button(self.root, text=text, command=lambda t=text: self.scientific_operation(t))
            btn.grid(row=row, column=col, padx=2, pady=2, sticky='nsew')
            
    def create_basic_operations(self):
        # Basic operations
        basic_buttons = [
            ('7', 4, 0), ('8', 4, 1), ('9', 4, 2),
            ('/', 4, 3), ('C', 4, 4),
            ('4', 5, 0), ('5', 5, 1), ('6', 5, 2),
            ('*', 5, 3), ('(', 5, 4),
            ('1', 6, 0), ('2', 6, 1), ('3', 6, 2),
            ('-', 6, 3), (')', 6, 4),
            ('0', 7, 0), ('.', 7, 1), ('=', 7, 2),
            ('+', 7, 3), ('M', 7, 4)
        ]
        
        for (text, row, col) in basic_buttons:
            btn = ttk.Button(self.root, text=text, command=lambda t=text: self.basic_operation(t))
            btn.grid(row=row, column=col, padx=2, pady=2, sticky='nsew')
            
    def scientific_operation(self, operation):
        try:
            current = self.display.get()
            if operation == 'sin':
                result = math.sin(math.radians(float(current)))
            elif operation == 'cos':
                result = math.cos(math.radians(float(current)))
            elif operation == 'tan':
                result = math.tan(math.radians(float(current)))
            elif operation == '√':
                result = math.sqrt(float(current))
            elif operation == 'x²':
                result = float(current) ** 2
            elif operation == 'log':
                result = math.log10(float(current))
            elif operation == 'ln':
                result = math.log(float(current))
            elif operation == 'π':
                result = math.pi
            elif operation == 'e':
                result = math.e
            elif operation == '!':
                result = math.factorial(int(float(current)))
            elif operation == 'Γ':
                result = special.gamma(float(current))
            elif operation == 'β':
                result = special.beta(float(current), 1)
            elif operation == '∫':
                # Simple integration example
                x = np.linspace(0, float(current), 100)
                y = x**2
                result = np.trapz(y, x)
            elif operation == '∑':
                # Simple summation example
                n = int(float(current))
                result = sum(range(1, n+1))
            elif operation == 'lim':
                # Simple limit example
                result = 1.0  # Placeholder for limit calculation
                
            self.display.delete(0, tk.END)
            self.display.insert(tk.END, str(result))
        except Exception as e:
            self.display.delete(0, tk.END)
            self.display.insert(tk.END, "Error")
            
    def basic_operation(self, operation):
        if operation == 'C':
            self.display.delete(0, tk.END)
        elif operation == '=':
            try:
                result = eval(self.display.get())
                self.display.delete(0, tk.END)
                self.display.insert(tk.END, str(result))
            except:
                self.display.delete(0, tk.END)
                self.display.insert(tk.END, "Error")
        elif operation == 'M':
            try:
                self.memory = float(self.display.get())
            except:
                self.memory = 0
        else:
            self.display.insert(tk.END, operation)

if __name__ == "__main__":
    root = tk.Tk()
    app = AdvancedCalculator(root)
    root.mainloop() 