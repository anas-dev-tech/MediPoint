from django.contrib import admin
from .models import Doctor, Specialty, Schedule, WorkingHours
from .forms import ScheduleTabularInlineModelForm

@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug':('name',)}
    

class ScheduleInline(admin.TabularInline):
    '''Tabular Inline View for Schedule'''
    model = Schedule
    form = ScheduleTabularInlineModelForm
    min_num = 0
    max_num = 10
    extra = 0



@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['start_time', 'end_time', 'day','doctor']
    
@admin.register(WorkingHours)
class WorkingHoursAdmin(admin.ModelAdmin):
    list_display = ['start_time', 'end_time','doctor']


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['user', 'fees', 'about', 'experience']
    list_filter = ['specialty']
    search_fields = ['user__full_name']
    inlines = [
        ScheduleInline
    ]
    