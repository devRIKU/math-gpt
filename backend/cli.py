import argparse
import sys
from math_gpt_core import MathGPT
import os
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.prompt import Prompt
from rich import print as rprint

def print_welcome():
    console = Console()
    ascii_art = '''
███╗   ███╗ █████╗ ████████╗██╗  ██╗ ██████╗ ██████╗ ████████╗
████╗ ████║██╔══██╗╚══██╔══╝██║  ██║██╔════╝ ██╔══██╗╚══██╔══╝
██╔████╔██║███████║   ██║   ███████║██║  ███╗██████╔╝   ██║   
██║╚██╔╝██║██╔══██║   ██║   ██╔══██║██║   ██║██╔═══╝    ██║   
██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║╚██████╔╝██║        ██║   
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝        ╚═╝
'''
    welcome_text = f"""
{ascii_art}

[bold purple]🤯🧮 Math got you stumped? 🤔 No sweat! 😎 Get your math problems solved here! ✅[/bold purple]

I'm your mathematical assistant. I can help you with:
• Solving equations
• Explaining mathematical concepts
• Providing step-by-step solutions
• Generating mathematical visualizations

[bold blue]Special Commands:[/bold blue]
• Type 'exit' or 'quit' to end the session
• Type 'clear' to clear conversation history
• Type 'history' to view conversation history

[bold green]Go Ahead, ask me anything! 💬[/bold green]
"""
    console.print(welcome_text)

def main():
    parser = argparse.ArgumentParser(description='Math GPT CLI - Your Mathematical Assistant')
    parser.add_argument('--api-key', help='Google Gemini API key (optional)')
    parser.add_argument('--no-history', action='store_true', help='Disable conversation history')
    args = parser.parse_args()

    # Initialize MathGPT
    math_gpt = MathGPT(api_key=args.api_key)
    console = Console()
    
    print_welcome()

    while True:
        try:
            # Get user input
            prompt = Prompt.ask("\n[bold blue]You[/bold blue]")
            
            # Handle special commands
            if prompt.lower() in ['exit', 'quit']:
                console.print("\n[bold green]Goodbye![/bold green]")
                break
            elif prompt.lower() == 'clear':
                math_gpt.clear_history()
                console.print("\n[bold green]Conversation history cleared[/bold green]")
                continue
            elif prompt.lower() == 'history':
                history = math_gpt.get_history()
                if not history:
                    console.print("\n[bold yellow]No conversation history[/bold yellow]")
                else:
                    console.print("\n[bold]Conversation History:[/bold]")
                    for i, msg in enumerate(history, 1):
                        role = "You" if i % 2 == 1 else "Math GPT"
                        color = "blue" if role == "You" else "green"
                        console.print(f"\n[{color}]{role}:[/{color}]")
                        console.print(Markdown(msg))
                continue

            # Get and display response
            console.print("\n[bold green]Math GPT[/bold green]")
            response = math_gpt.get_response(prompt, not args.no_history)
            console.print(Markdown(response))

        except KeyboardInterrupt:
            console.print("\n\n[bold yellow]Session interrupted. Type 'exit' to quit.[/bold yellow]")
        except Exception as e:
            console.print(f"\n[bold red]Error: {str(e)}[/bold red]")

if __name__ == '__main__':
    main() 