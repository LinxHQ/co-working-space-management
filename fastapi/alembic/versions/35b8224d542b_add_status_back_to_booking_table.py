"""add status back to booking table

Revision ID: 35b8224d542b
Revises: cdbe295dfe8c
Create Date: 2024-04-19 08:17:21.559731

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '35b8224d542b'
down_revision = 'cdbe295dfe8c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bookings', sa.Column('status', sa.Enum('cancelled', 'active'), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bookings', 'status')
    # ### end Alembic commands ###